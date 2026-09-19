/**
 * Shared Layout - Sidebar, Header, Footer
 */

const NAV_ITEMS = {
  admin: [
    { section: 'Main', items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'fa-home', href: 'dashboard.html' },
      { id: 'students', label: 'Students', icon: 'fa-user-graduate', href: 'students.html' },
      { id: 'teachers', label: 'Teachers', icon: 'fa-chalkboard-teacher', href: 'teachers.html' },
      { id: 'parents', label: 'Parents', icon: 'fa-users', href: 'parents.html' },
      { id: 'staff', label: 'Staff', icon: 'fa-user-tie', href: 'staff.html' }
    ]},
    { section: 'Academics', items: [
      { id: 'classes', label: 'Classes', icon: 'fa-school', href: 'classes.html' },
      { id: 'subjects', label: 'Subjects', icon: 'fa-book', href: 'subjects.html' },
      { id: 'attendance', label: 'Attendance', icon: 'fa-clipboard-check', href: 'attendance.html' },
      { id: 'timetable', label: 'Timetable', icon: 'fa-clock', href: 'timetable.html' },
      { id: 'homework', label: 'Homework', icon: 'fa-book-open', href: 'homework.html' },
      { id: 'exams', label: 'Exams & Results', icon: 'fa-file-alt', href: 'exams.html' }
    ]},
    { section: 'Finance', items: [
      { id: 'fees', label: 'Fees', icon: 'fa-money-bill-wave', href: 'fees.html' },
      { id: 'admissions', label: 'Admissions', icon: 'fa-user-plus', href: 'admissions.html' }
    ]},
    { section: 'Communication', items: [
      { id: 'leave', label: 'Leave Management', icon: 'fa-calendar-times', href: 'leave.html' },
      { id: 'notices', label: 'Notices', icon: 'fa-bullhorn', href: 'notices.html' },
      { id: 'messages', label: 'Messages', icon: 'fa-envelope', href: 'messages.html' },
      { id: 'whatsapp', label: 'WhatsApp Center', icon: 'fa-brands fa-whatsapp', href: 'whatsapp.html' }
    ]},
    { section: 'Other', items: [
      { id: 'reports', label: 'Reports', icon: 'fa-chart-bar', href: 'reports.html' },
      { id: 'documents', label: 'Documents', icon: 'fa-folder', href: 'documents.html' },
      { id: 'events', label: 'Events', icon: 'fa-calendar-alt', href: 'events.html' },
      { id: 'transport', label: 'Transport', icon: 'fa-bus', href: 'transport.html' },
      { id: 'settings', label: 'Settings', icon: 'fa-cog', href: 'settings.html' },
      { id: 'profile', label: 'Profile', icon: 'fa-user-circle', href: 'profile.html' }
    ]}
  ],
  teacher: [
    { section: 'Main', items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'fa-home', href: 'dashboard.html' },
      { id: 'attendance', label: 'Attendance', icon: 'fa-clipboard-check', href: 'attendance.html' },
      { id: 'homework', label: 'Homework', icon: 'fa-book-open', href: 'homework.html' },
      { id: 'timetable', label: 'Timetable', icon: 'fa-clock', href: 'timetable.html' },
      { id: 'exams', label: 'Exams & Results', icon: 'fa-file-alt', href: 'exams.html' },
      { id: 'leave', label: 'Leave', icon: 'fa-calendar-times', href: 'leave.html' },
      { id: 'notices', label: 'Notices', icon: 'fa-bullhorn', href: 'notices.html' },
      { id: 'messages', label: 'Messages', icon: 'fa-envelope', href: 'messages.html' },
      { id: 'profile', label: 'Profile', icon: 'fa-user-circle', href: 'profile.html' }
    ]}
  ],
  student: [
    { section: 'Main', items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'fa-home', href: 'dashboard.html' },
      { id: 'attendance', label: 'My Attendance', icon: 'fa-clipboard-check', href: 'attendance.html' },
      { id: 'homework', label: 'Homework', icon: 'fa-book-open', href: 'homework.html' },
      { id: 'timetable', label: 'Timetable', icon: 'fa-clock', href: 'timetable.html' },
      { id: 'exams', label: 'Results', icon: 'fa-file-alt', href: 'exams.html' },
      { id: 'fees', label: 'Fees', icon: 'fa-money-bill-wave', href: 'fees.html' },
      { id: 'notices', label: 'Notices', icon: 'fa-bullhorn', href: 'notices.html' },
      { id: 'profile', label: 'Profile', icon: 'fa-user-circle', href: 'profile.html' }
    ]}
  ],
  parent: [
    { section: 'Main', items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'fa-home', href: 'dashboard.html' },
      { id: 'students', label: 'My Children', icon: 'fa-user-graduate', href: 'students.html' },
      { id: 'attendance', label: 'Attendance', icon: 'fa-clipboard-check', href: 'attendance.html' },
      { id: 'homework', label: 'Homework', icon: 'fa-book-open', href: 'homework.html' },
      { id: 'fees', label: 'Fees', icon: 'fa-money-bill-wave', href: 'fees.html' },
      { id: 'exams', label: 'Results', icon: 'fa-file-alt', href: 'exams.html' },
      { id: 'notices', label: 'Notices', icon: 'fa-bullhorn', href: 'notices.html' },
      { id: 'messages', label: 'Messages', icon: 'fa-envelope', href: 'messages.html' },
      { id: 'profile', label: 'Profile', icon: 'fa-user-circle', href: 'profile.html' }
    ]}
  ],
  staff: [
    { section: 'Main', items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'fa-home', href: 'dashboard.html' },
      { id: 'leave', label: 'Leave', icon: 'fa-calendar-times', href: 'leave.html' },
      { id: 'notices', label: 'Notices', icon: 'fa-bullhorn', href: 'notices.html' },
      { id: 'profile', label: 'Profile', icon: 'fa-user-circle', href: 'profile.html' }
    ]}
  ]
};

function renderLayout(activePage) {
  const session = requireAuth();
  if (!session) return;

  const settings = getSettings();
  const nav = NAV_ITEMS[session.role] || NAV_ITEMS.admin;

  // Sidebar
  let navHtml = '';
  nav.forEach(sec => {
    navHtml += `<div class="nav-section"><div class="nav-section-title">${sec.section}</div>`;
    sec.items.forEach(item => {
      const active = item.id === activePage ? 'active' : '';
      navHtml += `<a class="nav-item ${active}" href="${item.href}"><i class="fas ${item.icon}"></i><span>${item.label}</span></a>`;
    });
    navHtml += '</div>';
  });

  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.innerHTML = `
      <div class="sidebar-header">
        <img src="${settings.logo || SCHOOL.logo}" alt="Logo" onerror="this.src='assets/logo/logo.svg'">
        <div class="school-name">${settings.schoolName || SCHOOL.name}</div>
      </div>
      <div class="sidebar-nav">${navHtml}</div>
      <div class="sidebar-footer">
        <a class="nav-item" href="#" onclick="logout(); return false;">
          <i class="fas fa-sign-out-alt"></i><span>Logout</span>
        </a>
      </div>`;
  }

  // Header
  const header = document.getElementById('topHeader');
  if (header) {
    const photo = session.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.name)}&background=1e3a5f&color=fff&size=72`;
    header.innerHTML = `
      <div class="header-left">
        <button class="menu-toggle" onclick="toggleSidebar()"><i class="fas fa-bars"></i></button>
        <div class="header-search">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Quick search..." id="globalSearch" onkeyup="if(event.key==='Enter') handleGlobalSearch(this.value)">
        </div>
      </div>
      <div class="header-right">
        <button class="header-icon-btn whatsapp-btn" title="WhatsApp ${settings.schoolWhatsapp || SCHOOL.whatsapp}"
          onclick="openWhatsApp('${settings.schoolWhatsapp || SCHOOL.whatsapp}')">
          <i class="fab fa-whatsapp"></i>
        </button>
        <button class="header-icon-btn" title="Notifications" onclick="showToast('No new notifications', 'info')">
          <i class="fas fa-bell"></i>
          <span class="badge" id="notifBadge" style="display:none">0</span>
        </button>
        <button class="header-icon-btn" title="Messages" onclick="window.location.href='messages.html'">
          <i class="fas fa-envelope"></i>
        </button>
        <div class="profile-dropdown" onclick="window.location.href='profile.html'">
          <img src="${photo}" alt="Profile">
          <div>
            <div class="name">${session.name}</div>
            <div class="role">${session.role.charAt(0).toUpperCase() + session.role.slice(1)}</div>
          </div>
        </div>
      </div>`;
  }

  // Footer
  const footer = document.getElementById('appFooter');
  if (footer) {
    footer.innerHTML = `
      <strong>${settings.schoolName || SCHOOL.name}</strong> &nbsp;|&nbsp;
      <a href="#" class="wa" onclick="openWhatsApp('${settings.schoolWhatsapp || SCHOOL.whatsapp}'); return false;">
        <i class="fab fa-whatsapp"></i> ${settings.schoolWhatsapp || SCHOOL.whatsapp}
      </a> &nbsp;|&nbsp;
      <span>&copy; ${new Date().getFullYear()} All Rights Reserved</span>`;
  }

  // Overlay
  if (!document.getElementById('sidebarOverlay')) {
    const overlay = document.createElement('div');
    overlay.id = 'sidebarOverlay';
    overlay.className = 'sidebar-overlay';
    overlay.onclick = toggleSidebar;
    document.body.appendChild(overlay);
  }

  // Date display if present
  const dateEl = document.getElementById('currentDate');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-PK', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.toggle('show');
  if (overlay) overlay.classList.toggle('show');
}

function handleGlobalSearch(q) {
  if (!q.trim()) return;
  showToast('Searching for: ' + q, 'info');
  // Could redirect to reports or students with query
}
