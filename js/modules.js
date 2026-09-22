/**
 * Module handlers for secondary pages
 */

const MODULE_CONFIG = {
  parents: {
    key: STORAGE_KEYS.parents,
    title: 'Parents',
    roles: ['admin'],
    fields: [
      { id: 'name', label: 'Parent Name', required: true },
      { id: 'relation', label: 'Relation', type: 'select', options: ['Father', 'Mother', 'Guardian'] },
      { id: 'phone', label: 'Phone' },
      { id: 'whatsapp', label: 'WhatsApp', required: true },
      { id: 'email', label: 'Email' },
      { id: 'address', label: 'Address', type: 'textarea' },
      { id: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'] }
    ],
    columns: ['name', 'relation', 'phone', 'whatsapp', 'status'],
    idPrefix: 'PAR'
  },
  staff: {
    key: STORAGE_KEYS.staff,
    title: 'Staff',
    roles: ['admin'],
    fields: [
      { id: 'name', label: 'Full Name', required: true },
      { id: 'staffId', label: 'Staff ID', required: true },
      { id: 'category', label: 'Category', type: 'select', options: ['Accountant', 'Receptionist', 'Security', 'Driver', 'Librarian', 'Office Staff', 'Other Staff'] },
      { id: 'phone', label: 'Phone' },
      { id: 'whatsapp', label: 'WhatsApp', required: true },
      { id: 'email', label: 'Email' },
      { id: 'salary', label: 'Salary', type: 'number' },
      { id: 'joiningDate', label: 'Joining Date', type: 'date' },
      { id: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'] }
    ],
    columns: ['name', 'staffId', 'category', 'phone', 'whatsapp', 'status'],
    idPrefix: 'STF'
  },
  classes: {
    key: STORAGE_KEYS.classes,
    title: 'Classes',
    roles: ['admin'],
    fields: [
      { id: 'name', label: 'Class Name', required: true },
      { id: 'sections', label: 'Sections (comma separated)', placeholder: 'A, B' }
    ],
    columns: ['name', 'sections', 'studentCount'],
    idPrefix: 'CLS'
  },
  subjects: {
    key: STORAGE_KEYS.subjects,
    title: 'Subjects',
    roles: ['admin'],
    fields: [
      { id: 'name', label: 'Subject Name', required: true },
      { id: 'code', label: 'Code', required: true }
    ],
    columns: ['name', 'code'],
    idPrefix: 'SUB'
  },
  notices: {
    key: STORAGE_KEYS.notices,
    title: 'Notices',
    roles: ['admin', 'teacher', 'student', 'parent', 'staff'],
    fields: [
      { id: 'title', label: 'Title', required: true },
      { id: 'content', label: 'Content', type: 'textarea', required: true },
      { id: 'audience', label: 'Audience', type: 'select', options: ['All', 'Students', 'Teachers', 'Parents', 'Staff'] },
      { id: 'date', label: 'Date', type: 'date' },
      { id: 'published', label: 'Published', type: 'select', options: ['true', 'false'] }
    ],
    columns: ['title', 'audience', 'date', 'published'],
    idPrefix: 'NTC'
  },
  leave: {
    key: STORAGE_KEYS.leaves,
    title: 'Leave Management',
    roles: ['admin', 'teacher', 'student', 'staff'],
    fields: [
      { id: 'name', label: 'Applicant Name', required: true },
      { id: 'type', label: 'Leave Type', type: 'select', options: ['Sick', 'Casual', 'Emergency', 'Other'] },
      { id: 'fromDate', label: 'From Date', type: 'date', required: true },
      { id: 'toDate', label: 'To Date', type: 'date', required: true },
      { id: 'reason', label: 'Reason', type: 'textarea' },
      { id: 'status', label: 'Status', type: 'select', options: ['pending', 'approved', 'rejected'] }
    ],
    columns: ['name', 'type', 'fromDate', 'toDate', 'status'],
    idPrefix: 'LEV'
  },
  homework: {
    key: STORAGE_KEYS.homework,
    title: 'Homework',
    roles: ['admin', 'teacher', 'student', 'parent'],
    fields: [
      { id: 'title', label: 'Title', required: true },
      { id: 'className', label: 'Class', required: true },
      { id: 'subject', label: 'Subject', required: true },
      { id: 'dueDate', label: 'Due Date', type: 'date' },
      { id: 'description', label: 'Description', type: 'textarea' }
    ],
    columns: ['title', 'className', 'subject', 'dueDate'],
    idPrefix: 'HW'
  },
  exams: {
    key: STORAGE_KEYS.exams,
    title: 'Exams & Results',
    roles: ['admin', 'teacher', 'student', 'parent'],
    fields: [
      { id: 'name', label: 'Exam Name', required: true },
      { id: 'className', label: 'Class' },
      { id: 'subject', label: 'Subject' },
      { id: 'date', label: 'Date', type: 'date' },
      { id: 'totalMarks', label: 'Total Marks', type: 'number' }
    ],
    columns: ['name', 'className', 'subject', 'date', 'totalMarks'],
    idPrefix: 'EXM'
  },
  admissions: {
    key: STORAGE_KEYS.admissions,
    title: 'Admissions',
    roles: ['admin'],
    fields: [
      { id: 'studentName', label: 'Student Name', required: true },
      { id: 'fatherName', label: 'Father Name' },
      { id: 'className', label: 'Applying Class', required: true },
      { id: 'phone', label: 'Phone' },
      { id: 'whatsapp', label: 'WhatsApp' },
      { id: 'status', label: 'Status', type: 'select', options: ['pending', 'approved', 'rejected'] }
    ],
    columns: ['studentName', 'fatherName', 'className', 'phone', 'status'],
    idPrefix: 'ADM'
  },
  events: {
    key: STORAGE_KEYS.events,
    title: 'Events',
    roles: ['admin'],
    fields: [
      { id: 'title', label: 'Event Title', required: true },
      { id: 'date', label: 'Date', type: 'date', required: true },
      { id: 'time', label: 'Time' },
      { id: 'location', label: 'Location' },
      { id: 'description', label: 'Description', type: 'textarea' }
    ],
    columns: ['title', 'date', 'time', 'location'],
    idPrefix: 'EVT'
  },
  transport: {
    key: STORAGE_KEYS.transport,
    title: 'Transport',
    roles: ['admin'],
    fields: [
      { id: 'vehicleNo', label: 'Vehicle Number', required: true },
      { id: 'driverName', label: 'Driver Name' },
      { id: 'driverPhone', label: 'Driver Phone' },
      { id: 'route', label: 'Route' },
      { id: 'capacity', label: 'Capacity', type: 'number' }
    ],
    columns: ['vehicleNo', 'driverName', 'driverPhone', 'route', 'capacity'],
    idPrefix: 'TRN'
  },
  messages: {
    key: STORAGE_KEYS.messages,
    title: 'Messages',
    roles: ['admin', 'teacher', 'parent', 'staff'],
    fields: [
      { id: 'to', label: 'To', required: true },
      { id: 'subject', label: 'Subject', required: true },
      { id: 'body', label: 'Message', type: 'textarea', required: true }
    ],
    columns: ['to', 'subject', 'body', 'date'],
    idPrefix: 'MSG'
  },
  documents: {
    key: null,
    title: 'Documents',
    roles: ['admin'],
    custom: true
  },
  reports: {
    key: null,
    title: 'Reports',
    roles: ['admin'],
    custom: true
  },
  attendance: {
    key: STORAGE_KEYS.attendance,
    title: 'Attendance',
    roles: ['admin', 'teacher', 'student', 'parent'],
    custom: true
  },
  timetable: {
    key: null,
    title: 'Timetable',
    roles: ['admin', 'teacher', 'student', 'parent'],
    custom: true
  },
  settings: {
    key: null,
    title: 'Settings',
    roles: ['admin'],
    custom: true
  },
  profile: {
    key: null,
    title: 'Profile',
    roles: ['admin', 'teacher', 'student', 'parent', 'staff'],
    custom: true
  }
};

let currentModule = null;
let editingId = null;

function initPage(pageId) {
  const config = MODULE_CONFIG[pageId];
  if (!config) {
    showToast('Module not found', 'error');
    return;
  }
  const session = requireAuth(config.roles);
  if (!session) return;
  renderLayout(pageId);
  currentModule = pageId;

  if (config.custom) {
    renderCustomPage(pageId, session);
    return;
  }

  if (session.role === 'admin' || (pageId === 'notices' && session.role === 'admin') ||
      (pageId === 'leave' && ['admin', 'teacher', 'student', 'staff'].includes(session.role)) ||
      (pageId === 'homework' && ['admin', 'teacher'].includes(session.role)) ||
      (pageId === 'admissions' && session.role === 'admin')) {
    const addBtn = document.getElementById('addBtn');
    if (addBtn) addBtn.style.display = '';
  }

  renderList();
}

function renderList() {
  const config = MODULE_CONFIG[currentModule];
  if (!config || !config.key) return;
  let list = getData(config.key);
  const q = (document.getElementById('searchInput')?.value || '').toLowerCase();
  if (q) {
    list = list.filter(item => JSON.stringify(item).toLowerCase().includes(q));
  }

  const session = getSession();
  // Role filters
  if (currentModule === 'leave' && session.role !== 'admin') {
    list = list.filter(l => l.name === session.name || l.userId === session.id);
  }
  if (currentModule === 'homework' && session.role === 'student') {
    // show all for simplicity
  }

  if (list.length === 0) {
    document.getElementById('listContainer').innerHTML = `
      <div class="empty-state"><i class="fas fa-inbox"></i><h3>No records found</h3>
      <p>Click "Add New" to create one</p></div>`;
    return;
  }

  let thead = '<tr>' + config.columns.map(c => `<th>${c.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</th>`).join('') +
    '<th class="no-print">Actions</th></tr>';
  let tbody = list.map(item => {
    let cells = config.columns.map(c => {
      let val = item[c];
      if (c === 'status' || c === 'published') {
        const ok = val === 'active' || val === 'approved' || val === true || val === 'true' || val === 'paid';
        const bad = val === 'inactive' || val === 'rejected' || val === 'pending' || val === false;
        return `<td><span class="badge badge-${ok ? 'success' : bad && val === 'pending' ? 'warning' : 'danger'}">${val}</span></td>`;
      }
      if (c === 'whatsapp' && val) {
        return `<td><button class="wa-btn" onclick="openWhatsApp('${val}')"><i class="fab fa-whatsapp"></i></button> ${val}</td>`;
      }
      if (Array.isArray(val)) val = val.join(', ');
      if (c.includes('Date') || c === 'date' || c === 'fromDate' || c === 'toDate' || c === 'dueDate') val = formatDate(val);
      return `<td>${val ?? '-'}</td>`;
    }).join('');
    const canEdit = session.role === 'admin' || (currentModule === 'leave' && item.status === 'pending');
    return `<tr>${cells}<td class="no-print"><div class="action-btns">
      ${canEdit ? `<button class="btn btn-icon btn-outline" onclick="editItem('${item.id}')"><i class="fas fa-edit"></i></button>
      <button class="btn btn-icon btn-outline" onclick="deleteItem('${item.id}')"><i class="fas fa-trash text-danger"></i></button>` : ''}
    </div></td></tr>`;
  }).join('');

  document.getElementById('listContainer').innerHTML = `
    <div class="table-responsive"><table class="table"><thead>${thead}</thead><tbody>${tbody}</tbody></table></div>`;
}

function openAddModal(id = null) {
  const config = MODULE_CONFIG[currentModule];
  editingId = id;
  document.getElementById('modalTitle').textContent = (id ? 'Edit ' : 'Add ') + config.title;
  let formHtml = '<form id="moduleForm">';
  config.fields.forEach(f => {
    formHtml += `<div class="form-group"><label class="form-label">${f.label}${f.required ? ' <span class="required">*</span>' : ''}</label>`;
    if (f.type === 'select') {
      formHtml += `<select class="form-select" id="f_${f.id}" ${f.required ? 'required' : ''}>`;
      (f.options || []).forEach(o => formHtml += `<option value="${o}">${o}</option>`);
      formHtml += '</select>';
    } else if (f.type === 'textarea') {
      formHtml += `<textarea class="form-textarea" id="f_${f.id}" ${f.required ? 'required' : ''}></textarea>`;
    } else {
      formHtml += `<input type="${f.type || 'text'}" class="form-control" id="f_${f.id}" ${f.required ? 'required' : ''} placeholder="${f.placeholder || ''}">`;
    }
    formHtml += '</div>';
  });
  formHtml += '</form>';
  document.getElementById('modalBody').innerHTML = formHtml;

  if (id) {
    const item = getData(config.key).find(x => x.id === id);
    if (item) {
      config.fields.forEach(f => {
        const el = document.getElementById('f_' + f.id);
        if (el) {
          let val = item[f.id];
          if (Array.isArray(val)) val = val.join(', ');
          if (typeof val === 'boolean') val = String(val);
          el.value = val ?? '';
        }
      });
    }
  } else {
    // defaults
    const dateField = document.getElementById('f_date') || document.getElementById('f_joiningDate') || document.getElementById('f_fromDate');
    if (dateField) dateField.value = today();
  }
  document.getElementById('addModal').classList.add('show');
}

function closeAddModal() {
  document.getElementById('addModal').classList.remove('show');
  editingId = null;
}

function saveItem() {
  const config = MODULE_CONFIG[currentModule];
  const form = document.getElementById('moduleForm');
  if (form && !form.checkValidity()) { form.reportValidity(); return; }
  const list = getData(config.key);
  const data = {};
  config.fields.forEach(f => {
    const el = document.getElementById('f_' + f.id);
    if (!el) return;
    let val = el.value;
    if (f.id === 'sections' && typeof val === 'string') val = val.split(',').map(s => s.trim()).filter(Boolean);
    if (f.id === 'published') val = val === 'true';
    if (f.type === 'number') val = Number(val) || 0;
    data[f.id] = val;
  });

  if (editingId) {
    const i = list.findIndex(x => x.id === editingId);
    if (i !== -1) {
      list[i] = { ...list[i], ...data };
      showToast('Updated successfully');
    }
  } else {
    data.id = generateId(config.idPrefix);
    if (currentModule === 'messages') {
      data.from = getSession().name;
      data.date = new Date().toISOString();
      data.read = false;
    }
    if (currentModule === 'leave') {
      data.userId = getSession().id;
      data.role = getSession().role;
      if (!data.status) data.status = 'pending';
    }
    list.push(data);
    showToast('Added successfully');
  }
  setData(config.key, list);
  logActivity(config.title, data.name || data.title || data.studentName || '');
  closeAddModal();
  renderList();
}

function editItem(id) { openAddModal(id); }

function deleteItem(id) {
  const config = MODULE_CONFIG[currentModule];
  confirmModal('Confirm Delete', 'Are you sure you want to delete this record?', () => {
    setData(config.key, getData(config.key).filter(x => x.id !== id));
    showToast('Deleted');
    renderList();
  });
}

// ========== CUSTOM PAGES ==========
function renderCustomPage(pageId, session) {
  const container = document.getElementById('listContainer');
  const addBtn = document.getElementById('addBtn');
  if (addBtn) addBtn.style.display = 'none';

  if (pageId === 'attendance') {
    renderAttendancePage(container, session);
  } else if (pageId === 'settings') {
    renderSettingsPage(container, session);
  } else if (pageId === 'profile') {
    renderProfilePage(container, session);
  } else if (pageId === 'reports') {
    renderReportsPage(container);
  } else if (pageId === 'documents') {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-folder-open"></i>
        <h3>Document Management</h3>
        <p>Store student, teacher and staff documents. Upload feature ready for backend integration (Firebase/Supabase).</p>
        <p class="text-muted">Currently using LocalStorage metadata. Connect cloud storage for file uploads.</p>
      </div>`;
  } else if (pageId === 'timetable') {
    container.innerHTML = `
      <div class="card-body">
        <p class="mb-3">Class & Teacher Timetable</p>
        <div class="table-responsive">
          <table class="table">
            <thead><tr><th>Period</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th></tr></thead>
            <tbody>
              <tr><td>1 (8:00-8:45)</td><td>English</td><td>Math</td><td>Science</td><td>Urdu</td><td>Islamiat</td></tr>
              <tr><td>2 (8:45-9:30)</td><td>Math</td><td>English</td><td>Urdu</td><td>Science</td><td>Computer</td></tr>
              <tr><td>3 (9:30-10:15)</td><td>Science</td><td>Urdu</td><td>Math</td><td>English</td><td>Social</td></tr>
              <tr><td colspan="6" style="text-align:center;color:var(--gray)">Break</td></tr>
              <tr><td>4 (10:45-11:30)</td><td>Urdu</td><td>Science</td><td>English</td><td>Math</td><td>Arts</td></tr>
              <tr><td>5 (11:30-12:15)</td><td>Computer</td><td>Islamiat</td><td>Social</td><td>Computer</td><td>Math</td></tr>
            </tbody>
          </table>
        </div>
        <p class="text-muted mt-3">Admin can customize timetable per class. Sample schedule shown.</p>
        <button class="btn btn-outline btn-sm no-print" onclick="window.print()"><i class="fas fa-print"></i> Print</button>
      </div>`;
  }
}

function renderAttendancePage(container, session) {
  const classes = getData(STORAGE_KEYS.classes);
  container.innerHTML = `
    <div class="filters-bar">
      <input type="date" class="form-control" id="attDate" value="${today()}" style="width:auto">
      <select class="form-select" id="attClass" style="width:auto">
        <option value="">Select Class</option>
        ${classes.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
      </select>
      <select class="form-select" id="attSection" style="width:auto">
        <option value="A">A</option><option value="B">B</option>
      </select>
      <button class="btn btn-primary btn-sm" onclick="loadAttendance()"><i class="fas fa-sync"></i> Load</button>
      <button class="btn btn-success btn-sm" onclick="markAllPresent()">Mark All Present</button>
      <button class="btn btn-primary btn-sm" onclick="saveAttendance()"><i class="fas fa-save"></i> Save</button>
    </div>
    <div id="attTable"></div>`;
}

function loadAttendance() {
  const cls = document.getElementById('attClass').value;
  const sec = document.getElementById('attSection').value;
  const date = document.getElementById('attDate').value;
  if (!cls) { showToast('Select a class', 'warning'); return; }
  const students = getData(STORAGE_KEYS.students).filter(s =>
    s.className === cls && s.section === sec && s.status === 'active'
  );
  // Load existing
  const att = getData(STORAGE_KEYS.attendance);
  const existing = att.find(a => a.date === date && a.className === cls && a.section === sec && a.type === 'student');
  const records = existing?.records || {};

  document.getElementById('attTable').innerHTML = students.length ? `
    <div class="table-responsive"><table class="table">
      <thead><tr><th>Roll</th><th>Name</th><th>Present</th><th>Absent</th><th>Late</th><th>Leave</th></tr></thead>
      <tbody>
        ${students.map(s => {
          const st = records[s.id] || 'present';
          return `<tr>
            <td>${s.rollNo||'-'}</td>
            <td class="fw-bold">${s.name}</td>
            <td><input type="radio" name="att_${s.id}" value="present" ${st==='present'?'checked':''}></td>
            <td><input type="radio" name="att_${s.id}" value="absent" ${st==='absent'?'checked':''}></td>
            <td><input type="radio" name="att_${s.id}" value="late" ${st==='late'?'checked':''}></td>
            <td><input type="radio" name="att_${s.id}" value="leave" ${st==='leave'?'checked':''}></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table></div>` : '<div class="empty-state"><h3>No students in this class/section</h3></div>';
}

function markAllPresent() {
  document.querySelectorAll('#attTable input[value="present"]').forEach(r => r.checked = true);
}

function saveAttendance() {
  const cls = document.getElementById('attClass').value;
  const sec = document.getElementById('attSection').value;
  const date = document.getElementById('attDate').value;
  if (!cls) return;
  const students = getData(STORAGE_KEYS.students).filter(s =>
    s.className === cls && s.section === sec && s.status === 'active'
  );
  const records = {};
  students.forEach(s => {
    const checked = document.querySelector(`input[name="att_${s.id}"]:checked`);
    records[s.id] = checked ? checked.value : 'present';
  });
  let att = getData(STORAGE_KEYS.attendance);
  const idx = att.findIndex(a => a.date === date && a.className === cls && a.section === sec && a.type === 'student');
  const entry = {
    id: idx >= 0 ? att[idx].id : generateId('ATT'),
    type: 'student', date, className: cls, section: sec, records,
    markedBy: getSession().name, markedAt: new Date().toISOString()
  };
  // Convert records object for dashboard count
  entry.recordsList = Object.entries(records).map(([sid, status]) => ({ studentId: sid, status }));
  if (idx >= 0) att[idx] = entry;
  else att.push(entry);
  // Also store in format for stats
  entry.records = entry.recordsList;
  setData(STORAGE_KEYS.attendance, att);
  showToast('Attendance saved successfully');
  logActivity('Attendance', `${cls}-${sec} on ${date}`);
}

function renderSettingsPage(container) {
  if (typeof initSettings === 'function') {
    initSettings();
    return;
  }
  const s = getSettings();
  container.innerHTML = `
    <div class="card mb-3"><div class="card-header"><h2>School Logo</h2></div>
    <div class="card-body"><p class="text-muted">Upload settings.js for full logo options (Add / Remove Logo).</p>
    <img src="${s.logo || 'assets/logo/school-logo.png'}" style="width:80px;height:80px;object-fit:contain;background:#fff;border-radius:12px" onerror="this.src='assets/logo/school-logo.png'">
    </div></div>
    <form id="settingsForm" onsubmit="saveSettingsForm(event)">
      <h3 style="margin-bottom:16px;color:var(--primary-dark)">School Settings</h3>
      <div class="form-row">
        <div><label class="form-label">School Name</label>
          <input type="text" class="form-control" id="setName" value="${s.schoolName||''}"></div>
        <div><label class="form-label">Phone</label>
          <input type="text" class="form-control" id="setPhone" value="${s.schoolPhone||''}"></div>
      </div>
      <div class="form-row">
        <div><label class="form-label">WhatsApp Number</label>
          <input type="text" class="form-control" id="setWa" value="${s.schoolWhatsapp||'03304886710'}"></div>
        <div><label class="form-label">Email</label>
          <input type="email" class="form-control" id="setEmail" value="${s.schoolEmail||''}"></div>
      </div>
      <div class="form-row">
        <div style="grid-column:1/-1"><label class="form-label">Address</label>
          <textarea class="form-textarea" id="setAddress">${s.schoolAddress||''}</textarea></div>
      </div>
      <button type="submit" class="btn btn-primary mt-3"><i class="fas fa-save"></i> Save Settings</button>
    </form>`;
}


function saveSettingsForm(e) {
  e.preventDefault();
  const settings = {
    schoolName: document.getElementById('setName').value,
    schoolPhone: document.getElementById('setPhone').value,
    schoolWhatsapp: document.getElementById('setWa').value,
    schoolEmail: document.getElementById('setEmail').value,
    schoolAddress: document.getElementById('setAddress').value,
    logo: SCHOOL.logo
  };
  saveSettings(settings);
  const newPass = document.getElementById('setNewPass').value;
  const confirm = document.getElementById('setConfirmPass').value;
  if (newPass) {
    if (newPass !== confirm) { showToast('Passwords do not match', 'error'); return; }
    const users = getData(STORAGE_KEYS.users);
    const admin = users.find(u => u.role === 'admin');
    if (admin) {
      admin.password = newPass;
      setData(STORAGE_KEYS.users, users);
    }
  }
  showToast('Settings saved');
  logActivity('Settings', 'Updated school settings');
}

function exportData() {
  const data = {};
  Object.values(STORAGE_KEYS).forEach(k => {
    if (k !== STORAGE_KEYS.session) data[k] = getData(k);
  });
  data.settings = getSettings();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'smps-backup-' + today() + '.json';
  a.click();
  showToast('Data exported');
}

function renderProfilePage(container, session) {
  const photo = session.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.name)}&background=1e3a5f&color=fff&size=128`;
  container.innerHTML = `
    <div class="profile-header">
      <img src="${photo}" alt="Profile">
      <div>
        <h2>${session.name}</h2>
        <p>${session.role.charAt(0).toUpperCase() + session.role.slice(1)} &bull; ${session.username || ''}</p>
        <p>${session.email || ''} ${session.phone ? '• ' + session.phone : ''}</p>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <h3 style="margin-bottom:16px">Account Information</h3>
        <div class="form-row">
          <div><strong>Name</strong><br>${session.name}</div>
          <div><strong>Role</strong><br>${session.role}</div>
          <div><strong>Username</strong><br>${session.username || '-'}</div>
          <div><strong>Login Time</strong><br>${formatDate(session.loginAt)} ${session.loginAt ? new Date(session.loginAt).toLocaleTimeString() : ''}</div>
        </div>
        <div class="mt-3 d-flex gap-2">
          <button class="btn btn-outline" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Logout</button>
          <button class="wa-btn" onclick="openWhatsApp('03304886710')"><i class="fab fa-whatsapp"></i> Contact School</button>
        </div>
      </div>
    </div>`;
}

function renderReportsPage(container) {
  const stats = getDashboardStats();
  container.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card" onclick="window.location.href='students.html'"><div class="stat-icon blue"><i class="fas fa-user-graduate"></i></div>
        <div class="stat-info"><h3>${stats.totalStudents}</h3><p>Students Report</p></div></div>
      <div class="stat-card" onclick="window.location.href='teachers.html'"><div class="stat-icon green"><i class="fas fa-chalkboard-teacher"></i></div>
        <div class="stat-info"><h3>${stats.totalTeachers}</h3><p>Teachers Report</p></div></div>
      <div class="stat-card" onclick="window.location.href='fees.html'"><div class="stat-icon orange"><i class="fas fa-money-bill"></i></div>
        <div class="stat-info"><h3>${formatCurrency(stats.monthlyFeeCollection)}</h3><p>Fee Collection</p></div></div>
      <div class="stat-card" onclick="window.location.href='whatsapp.html'"><div class="stat-icon teal"><i class="fab fa-whatsapp"></i></div>
        <div class="stat-info"><h3>Contacts</h3><p>WhatsApp Report</p></div></div>
    </div>
    <div class="card"><div class="card-body">
      <h3 style="margin-bottom:12px">Available Reports</h3>
      <div class="d-flex gap-2" style="flex-wrap:wrap">
        <a href="students.html" class="btn btn-outline btn-sm">Student Report</a>
        <a href="teachers.html" class="btn btn-outline btn-sm">Teacher Report</a>
        <a href="fees.html" class="btn btn-outline btn-sm">Fee Report</a>
        <a href="attendance.html" class="btn btn-outline btn-sm">Attendance Report</a>
        <a href="admissions.html" class="btn btn-outline btn-sm">Admission Report</a>
        <a href="leave.html" class="btn btn-outline btn-sm">Leave Report</a>
        <a href="whatsapp.html" class="btn btn-outline btn-sm">WhatsApp Contacts</a>
        <button class="btn btn-primary btn-sm" onclick="exportData()"><i class="fas fa-download"></i> Export All Data</button>
      </div>
    </div></div>`;
}
