/**
 * Dashboard Module - Charts & Stats
 * THE SMART MODERN PUBLIC SCHOOL
 */

function initDashboard() {
  const session = requireAuth();
  if (!session) return;
  renderLayout('dashboard');

  const nameEl = document.getElementById('welcomeName');
  if (nameEl) nameEl.textContent = (session.name || 'Admin').split(' ')[0];

  renderDashboardStats(session);
  renderDashboardCharts();
  renderRecentNotices();
}

function renderDashboardStats(session) {
  const stats = getDashboardStats();
  const statsConfig = [
    { label: 'Total Students', value: stats.totalStudents, icon: 'fa-user-graduate', color: 'blue', href: 'students.html', change: '' },
    { label: 'Total Teachers', value: stats.totalTeachers, icon: 'fa-chalkboard-teacher', color: 'green', href: 'teachers.html', change: '' },
    { label: 'Total Parents', value: stats.totalParents, icon: 'fa-users', color: 'purple', href: 'parents.html', change: '' },
    { label: 'Total Staff', value: stats.totalStaff, icon: 'fa-user-tie', color: 'teal', href: 'staff.html', change: '' },
    { label: 'Total Classes', value: stats.totalClasses, icon: 'fa-school', color: 'orange', href: 'classes.html', change: '' },
    { label: "Today's Attendance", value: stats.todayAttendance, icon: 'fa-clipboard-check', color: 'green', href: 'attendance.html', change: '' },
    { label: 'Monthly Fee Collection', value: formatCurrency(stats.monthlyFeeCollection), icon: 'fa-money-bill-wave', color: 'blue', href: 'fees.html', change: '' },
    { label: 'Pending Fees', value: formatCurrency(stats.pendingFees), icon: 'fa-exclamation-circle', color: 'red', href: 'fees.html', change: '' },
    { label: 'New Admissions', value: stats.newAdmissions, icon: 'fa-user-plus', color: 'orange', href: 'admissions.html', change: '' },
    { label: 'Pending Leaves', value: stats.pendingLeaves, icon: 'fa-calendar-times', color: 'purple', href: 'leave.html', change: '' }
  ];

  let filtered = statsConfig;
  if (session.role === 'teacher') filtered = statsConfig.filter((_, i) => [0, 5].includes(i));
  if (session.role === 'student' || session.role === 'parent') filtered = statsConfig.filter((_, i) => [0, 5, 6, 7].includes(i));
  if (session.role === 'staff') filtered = statsConfig.slice(0, 4);

  const grid = document.getElementById('statsGrid');
  if (!grid) return;
  grid.innerHTML = filtered.map(s => `
    <div class="stat-card" onclick="window.location.href='${s.href}'">
      <div class="stat-icon ${s.color}"><i class="fas ${s.icon}"></i></div>
      <div class="stat-info">
        <h3>${s.value}</h3>
        <p>${s.label}</p>
        ${s.change ? `<div class="stat-change up"><i class="fas fa-arrow-up"></i> ${s.change}</div>` : ''}
      </div>
    </div>
  `).join('');
}

function renderDashboardCharts() {
  if (typeof Chart === 'undefined') return;

  // Enrollment trend
  const enrollEl = document.getElementById('enrollChart');
  if (enrollEl) {
    const studentsAll = getData(STORAGE_KEYS.students);
    const monthLabels = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      monthLabels.push(d.toLocaleString('en', { month: 'short', year: '2-digit' }));
    }
    let cum = 0;
    const enrollCum = monthLabels.map((_, i) => {
      cum += (i === 5 ? studentsAll.length : Math.max(1, Math.floor(studentsAll.length / 6)));
      return cum;
    });
    new Chart(enrollEl, {
      type: 'line',
      data: {
        labels: monthLabels,
        datasets: [{
          label: 'Enrollment',
          data: enrollCum,
          borderColor: '#2c5aa0',
          backgroundColor: 'rgba(44,90,160,0.12)',
          fill: true,
          tension: 0.35,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });
  }

  // Fee collection line
  const feeLineEl = document.getElementById('feeLineChart');
  if (feeLineEl) {
    const feesAll = getData(STORAGE_KEYS.fees);
    const monthLabels = [];
    const feeMonthData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      monthLabels.push(d.toLocaleString('en', { month: 'short', year: '2-digit' }));
      const key = d.toISOString().substring(0, 7);
      feeMonthData.push(
        feesAll.filter(f => f.status === 'paid' && (f.month || f.paymentDate || '').startsWith(key))
          .reduce((s, f) => s + Number(f.paid || 0), 0)
      );
    }
    new Chart(feeLineEl, {
      type: 'line',
      data: {
        labels: monthLabels,
        datasets: [{
          label: 'Collection (Rs)',
          data: feeMonthData,
          borderColor: '#28a745',
          backgroundColor: 'rgba(40,167,69,0.12)',
          fill: true,
          tension: 0.35,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  // Class-wise bar
  const classEl = document.getElementById('classChart');
  if (classEl) {
    const classData = getClassWiseStudents();
    new Chart(classEl, {
      type: 'bar',
      data: {
        labels: Object.keys(classData),
        datasets: [{
          label: 'Students',
          data: Object.values(classData),
          backgroundColor: 'rgba(44, 90, 160, 0.75)',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });
  }

  // Gender doughnut
  const genderEl = document.getElementById('genderChart');
  if (genderEl) {
    const gender = getGenderDistribution();
    new Chart(genderEl, {
      type: 'doughnut',
      data: {
        labels: ['Male', 'Female'],
        datasets: [{
          data: [gender.male, gender.female],
          backgroundColor: ['#2c5aa0', '#f0a500'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  // Fee status pie
  const feeEl = document.getElementById('feeChart');
  if (feeEl) {
    const feeStatus = getFeeStatusCounts();
    new Chart(feeEl, {
      type: 'pie',
      data: {
        labels: ['Paid', 'Pending', 'Partial'],
        datasets: [{
          data: [feeStatus.paid, feeStatus.pending, feeStatus.partial],
          backgroundColor: ['#28a745', '#dc3545', '#ffc107'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  // Teacher/Staff bar
  const staffEl = document.getElementById('staffChart');
  if (staffEl) {
    const teachers = getData(STORAGE_KEYS.teachers).filter(t => t.status === 'active').length;
    const staff = getData(STORAGE_KEYS.staff).filter(s => s.status === 'active').length;
    new Chart(staffEl, {
      type: 'bar',
      data: {
        labels: ['Teachers', 'Staff'],
        datasets: [{
          label: 'Count',
          data: [teachers, staff],
          backgroundColor: ['#2c5aa0', '#17a2b8'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });
  }
}

function renderRecentNotices() {
  const noticesEl = document.getElementById('recentNotices');
  if (!noticesEl) return;
  const notices = getData(STORAGE_KEYS.notices).filter(n => n.published).slice(0, 5);
  if (notices.length === 0) {
    noticesEl.innerHTML = '<div class="empty-state"><i class="fas fa-bullhorn"></i><h3>No notices yet</h3></div>';
  } else {
    noticesEl.innerHTML = notices.map(n => `
      <div style="padding:12px 0;border-bottom:1px solid var(--gray-light)">
        <div class="fw-bold">${n.title}</div>
        <div class="text-muted" style="font-size:0.85rem;margin-top:4px">${(n.content || '').substring(0, 120)}${(n.content || '').length > 120 ? '...' : ''}</div>
        <div style="font-size:0.75rem;color:var(--gray);margin-top:6px">
          <i class="fas fa-calendar"></i> ${formatDate(n.date)} &nbsp; <span class="badge badge-primary">${n.audience}</span>
        </div>
      </div>
    `).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('statsGrid')) initDashboard();
});
