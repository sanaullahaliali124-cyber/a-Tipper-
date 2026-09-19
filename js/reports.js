/**
 * Reports Module
 * THE SMART MODERN PUBLIC SCHOOL
 */

function initReports() {
  const session = requireAuth(['admin']);
  if (!session) return;
  renderLayout('reports');

  const container = document.getElementById('listContainer');
  if (!container) return;

  const stats = getDashboardStats();
  container.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card" onclick="window.location.href='students.html'">
        <div class="stat-icon blue"><i class="fas fa-user-graduate"></i></div>
        <div class="stat-info"><h3>${stats.totalStudents}</h3><p>Students Report</p></div>
      </div>
      <div class="stat-card" onclick="window.location.href='teachers.html'">
        <div class="stat-icon green"><i class="fas fa-chalkboard-teacher"></i></div>
        <div class="stat-info"><h3>${stats.totalTeachers}</h3><p>Teachers Report</p></div>
      </div>
      <div class="stat-card" onclick="window.location.href='fees.html'">
        <div class="stat-icon orange"><i class="fas fa-money-bill"></i></div>
        <div class="stat-info"><h3>${formatCurrency(stats.monthlyFeeCollection)}</h3><p>Fee Collection</p></div>
      </div>
      <div class="stat-card" onclick="window.location.href='whatsapp.html'">
        <div class="stat-icon teal"><i class="fab fa-whatsapp"></i></div>
        <div class="stat-info"><h3>Contacts</h3><p>WhatsApp Report</p></div>
      </div>
    </div>
    <div class="card"><div class="card-body">
      <h3 style="margin-bottom:12px">Available Reports</h3>
      <div class="d-flex gap-2" style="flex-wrap:wrap">
        <a href="students.html" class="btn btn-outline btn-sm">Student Report</a>
        <a href="teachers.html" class="btn btn-outline btn-sm">Teacher Report</a>
        <a href="parents.html" class="btn btn-outline btn-sm">Parent Report</a>
        <a href="staff.html" class="btn btn-outline btn-sm">Staff Report</a>
        <a href="fees.html" class="btn btn-outline btn-sm">Fee Report</a>
        <a href="attendance.html" class="btn btn-outline btn-sm">Attendance Report</a>
        <a href="admissions.html" class="btn btn-outline btn-sm">Admission Report</a>
        <a href="leave.html" class="btn btn-outline btn-sm">Leave Report</a>
        <a href="results.html" class="btn btn-outline btn-sm">Result Report</a>
        <a href="whatsapp.html" class="btn btn-outline btn-sm">WhatsApp Contacts</a>
        <button class="btn btn-primary btn-sm" onclick="exportAllData()"><i class="fas fa-download"></i> Export All Data</button>
        <button class="btn btn-outline btn-sm" onclick="window.print()"><i class="fas fa-print"></i> Print</button>
      </div>
    </div></div>`;
}

function exportAllData() {
  const data = {};
  Object.values(STORAGE_KEYS).forEach(k => {
    if (k !== STORAGE_KEYS.session) data[k] = getData(k);
  });
  data.settings = getSettings();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'smps-report-' + today() + '.json';
  a.click();
  showToast('Report exported');
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('reports')) initReports();
});
