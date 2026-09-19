/**
 * WhatsApp Center Module
 * THE SMART MODERN PUBLIC SCHOOL
 * School WhatsApp: 03304886710
 */

let waCurrentTab = 'students';

function initWhatsApp() {
  const session = requireAuth(['admin', 'teacher', 'staff']);
  if (!session) return;
  renderLayout('whatsapp');

  const settings = getSettings();
  const schoolWa = document.getElementById('schoolWa');
  if (schoolWa) schoolWa.textContent = settings.schoolWhatsapp || SCHOOL.whatsapp || '03304886710';

  const classes = getData(STORAGE_KEYS.classes);
  const filter = document.getElementById('waClassFilter');
  if (filter) {
    classes.forEach(c => {
      filter.innerHTML += `<option value="${c.name}">${c.name}</option>`;
    });
  }
  showWaTab('students');
}

function showWaTab(tab) {
  waCurrentTab = tab;
  ['students', 'teachers', 'parents', 'staff'].forEach(t => {
    const btn = document.getElementById('tab' + t.charAt(0).toUpperCase() + t.slice(1));
    if (btn) btn.className = t === tab ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm';
  });
  const classFilter = document.getElementById('waClassFilter');
  if (classFilter) classFilter.style.display = tab === 'students' ? '' : 'none';
  renderWaContacts();
}

function renderWaContacts() {
  const q = (document.getElementById('waSearch')?.value || '').toLowerCase();
  const fClass = document.getElementById('waClassFilter')?.value || '';
  let html = '', head = '';

  if (waCurrentTab === 'students') {
    head = '<tr><th>Student Name</th><th>Admission No</th><th>Class</th><th>Section</th><th>Father/Guardian</th><th>WhatsApp</th><th>Alt Number</th><th>Status</th><th>Action</th></tr>';
    let list = getData(STORAGE_KEYS.students);
    list = list.filter(s => {
      if (q && !(s.name + s.admissionNo + s.whatsapp + (s.fatherName || '')).toLowerCase().includes(q)) return false;
      if (fClass && s.className !== fClass) return false;
      return true;
    });
    html = list.map(s => `<tr>
      <td class="fw-bold">${s.name}</td>
      <td>${s.admissionNo}</td>
      <td>${s.className || '-'}</td>
      <td>${s.section || '-'}</td>
      <td>${s.fatherName || '-'}</td>
      <td>${s.whatsapp || '-'}</td>
      <td>${s.altPhone || '-'}</td>
      <td><span class="badge badge-${s.status === 'active' ? 'success' : 'danger'}">${s.status}</span></td>
      <td>
        ${s.whatsapp ? `<button class="wa-btn" onclick="openWhatsApp('${s.whatsapp}')"><i class="fab fa-whatsapp"></i> Chat</button>
        <button class="btn btn-icon btn-outline btn-sm" onclick="copyToClipboard('${s.whatsapp}')"><i class="fas fa-copy"></i></button>` : '-'}
      </td>
    </tr>`).join('') || '<tr><td colspan="9" style="text-align:center;padding:24px" class="text-muted">No contacts</td></tr>';
  } else if (waCurrentTab === 'teachers') {
    head = '<tr><th>Teacher Name</th><th>Teacher ID</th><th>Subject</th><th>Phone</th><th>WhatsApp</th><th>Status</th><th>Action</th></tr>';
    let list = getData(STORAGE_KEYS.teachers);
    list = list.filter(t => !q || (t.name + t.teacherId + t.whatsapp).toLowerCase().includes(q));
    html = list.map(t => `<tr>
      <td class="fw-bold">${t.name}</td><td>${t.teacherId}</td><td>${t.subject || '-'}</td>
      <td>${t.phone || '-'}</td><td>${t.whatsapp || '-'}</td>
      <td><span class="badge badge-${t.status === 'active' ? 'success' : 'danger'}">${t.status}</span></td>
      <td>${t.whatsapp ? `<button class="wa-btn" onclick="openWhatsApp('${t.whatsapp}')"><i class="fab fa-whatsapp"></i></button>
        <button class="btn btn-icon btn-outline btn-sm" onclick="copyToClipboard('${t.whatsapp}')"><i class="fas fa-copy"></i></button>` : '-'}</td>
    </tr>`).join('') || '<tr><td colspan="7" style="text-align:center" class="text-muted">No contacts</td></tr>';
  } else if (waCurrentTab === 'parents') {
    head = '<tr><th>Parent Name</th><th>Relation</th><th>Phone</th><th>WhatsApp</th><th>Status</th><th>Action</th></tr>';
    let list = getData(STORAGE_KEYS.parents);
    list = list.filter(p => !q || (p.name + p.phone + p.whatsapp).toLowerCase().includes(q));
    html = list.map(p => `<tr>
      <td class="fw-bold">${p.name}</td><td>${p.relation || '-'}</td><td>${p.phone || '-'}</td><td>${p.whatsapp || '-'}</td>
      <td><span class="badge badge-${p.status === 'active' ? 'success' : 'danger'}">${p.status}</span></td>
      <td>${p.whatsapp ? `<button class="wa-btn" onclick="openWhatsApp('${p.whatsapp}')"><i class="fab fa-whatsapp"></i></button>
        <button class="btn btn-icon btn-outline btn-sm" onclick="copyToClipboard('${p.whatsapp}')"><i class="fas fa-copy"></i></button>` : '-'}</td>
    </tr>`).join('') || '<tr><td colspan="6" style="text-align:center" class="text-muted">No contacts</td></tr>';
  } else {
    head = '<tr><th>Staff Name</th><th>Staff ID</th><th>Category</th><th>Phone</th><th>WhatsApp</th><th>Status</th><th>Action</th></tr>';
    let list = getData(STORAGE_KEYS.staff);
    list = list.filter(s => !q || (s.name + s.staffId + s.whatsapp).toLowerCase().includes(q));
    html = list.map(s => `<tr>
      <td class="fw-bold">${s.name}</td><td>${s.staffId}</td><td>${s.category || '-'}</td>
      <td>${s.phone || '-'}</td><td>${s.whatsapp || '-'}</td>
      <td><span class="badge badge-${s.status === 'active' ? 'success' : 'danger'}">${s.status}</span></td>
      <td>${s.whatsapp ? `<button class="wa-btn" onclick="openWhatsApp('${s.whatsapp}')"><i class="fab fa-whatsapp"></i></button>
        <button class="btn btn-icon btn-outline btn-sm" onclick="copyToClipboard('${s.whatsapp}')"><i class="fas fa-copy"></i></button>` : '-'}</td>
    </tr>`).join('') || '<tr><td colspan="7" style="text-align:center" class="text-muted">No contacts</td></tr>';
  }

  const headEl = document.getElementById('waHead');
  const bodyEl = document.getElementById('waBody');
  if (headEl) headEl.innerHTML = head;
  if (bodyEl) bodyEl.innerHTML = html;
}

// Alias for HTML onclick
function showTab(tab) { showWaTab(tab); }
function renderContacts() { renderWaContacts(); }

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('schoolWa') || document.getElementById('waBody')) initWhatsApp();
});
