/**
 * Students Module
 * THE SMART MODERN PUBLIC SCHOOL
 */

let studentEditingId = null;

function initStudents() {
  const session = requireAuth(['admin', 'teacher', 'parent']);
  if (!session) return;
  renderLayout('students');

  if (session.role !== 'admin') {
    const btn = document.getElementById('addStudentBtn');
    if (btn) btn.style.display = 'none';
  }

  const classes = getData(STORAGE_KEYS.classes);
  const classSelect = document.getElementById('filterClass');
  const sClass = document.getElementById('sClass');
  if (classSelect) {
    classes.forEach(c => {
      classSelect.innerHTML += `<option value="${c.name}">${c.name}</option>`;
    });
  }
  if (sClass) {
    classes.forEach(c => {
      sClass.innerHTML += `<option value="${c.name}">${c.name}</option>`;
    });
  }

  const admDate = document.getElementById('sAdmissionDate');
  if (admDate) admDate.value = today();

  renderStudents();
}

function renderStudents() {
  const session = getSession();
  let students = getData(STORAGE_KEYS.students);

  if (session && session.role === 'parent') {
    const parents = getData(STORAGE_KEYS.parents);
    const parent = parents.find(p => p.id === session.id);
    if (parent && parent.studentIds) {
      students = students.filter(s => parent.studentIds.includes(s.id));
    } else {
      students = [];
    }
  }

  const q = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const fClass = document.getElementById('filterClass')?.value || '';
  const fSec = document.getElementById('filterSection')?.value || '';
  const fStatus = document.getElementById('filterStatus')?.value || '';

  students = students.filter(s => {
    if (q && !(s.name + s.admissionNo + s.phone + s.whatsapp + (s.fatherName || '')).toLowerCase().includes(q)) return false;
    if (fClass && s.className !== fClass) return false;
    if (fSec && s.section !== fSec) return false;
    if (fStatus && s.status !== fStatus) return false;
    return true;
  });

  const tbody = document.getElementById('studentsBody');
  const empty = document.getElementById('emptyStudents');
  if (!tbody) return;

  if (students.length === 0) {
    tbody.innerHTML = '';
    if (empty) empty.classList.remove('hidden');
    return;
  }
  if (empty) empty.classList.add('hidden');

  const canEdit = getSession() && getSession().role === 'admin';
  tbody.innerHTML = students.map(s => {
    const photo = s.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=2c5aa0&color=fff&size=72`;
    return `<tr>
      <td><img class="avatar" src="${photo}" alt=""></td>
      <td>${s.admissionNo}</td>
      <td class="fw-bold">${s.name}</td>
      <td>${s.fatherName || s.guardianName || '-'}</td>
      <td>${s.className || '-'}</td>
      <td>${s.section || '-'}</td>
      <td>${s.phone || '-'}</td>
      <td>${s.whatsapp ? `<button class="wa-btn" onclick="openWhatsApp('${s.whatsapp}')"><i class="fab fa-whatsapp"></i> Chat</button>` : '-'}</td>
      <td><span class="badge badge-${s.status === 'active' ? 'success' : 'danger'}">${s.status}</span></td>
      <td class="no-print">
        <div class="action-btns">
          <button class="btn btn-icon btn-outline" title="View" onclick="viewStudent('${s.id}')"><i class="fas fa-eye"></i></button>
          ${canEdit ? `<button class="btn btn-icon btn-outline" title="Edit" onclick="editStudent('${s.id}')"><i class="fas fa-edit"></i></button>
          <button class="btn btn-icon btn-outline" title="Delete" onclick="deleteStudent('${s.id}')"><i class="fas fa-trash text-danger"></i></button>` : ''}
        </div>
      </td>
    </tr>`;
  }).join('');
}

function openStudentModal(id = null) {
  studentEditingId = id;
  const title = document.getElementById('modalTitle');
  if (title) title.textContent = id ? 'Edit Student' : 'Add Student';
  const form = document.getElementById('studentForm');
  if (form) form.reset();
  if (document.getElementById('studentId')) document.getElementById('studentId').value = '';
  if (document.getElementById('sAdmissionDate')) document.getElementById('sAdmissionDate').value = today();
  if (document.getElementById('sStatus')) document.getElementById('sStatus').value = 'active';

  if (id) {
    const s = getData(STORAGE_KEYS.students).find(x => x.id === id);
    if (s) {
      const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
      set('studentId', s.id);
      set('sName', s.name);
      set('sFather', s.fatherName);
      set('sAdmissionNo', s.admissionNo);
      set('sRollNo', s.rollNo);
      set('sClass', s.className);
      set('sSection', s.section || 'A');
      set('sGender', s.gender || 'Male');
      set('sDob', s.dob);
      set('sPhone', s.phone);
      set('sWhatsapp', s.whatsapp);
      set('sAltPhone', s.altPhone);
      set('sAdmissionDate', s.admissionDate);
      set('sBlood', s.bloodGroup);
      set('sStatus', s.status || 'active');
      set('sAddress', s.address);
      set('sPrevSchool', s.previousSchool);
      set('sEmergency', s.emergencyContact);
    }
  } else {
    const count = getData(STORAGE_KEYS.students).length + 1;
    if (document.getElementById('sAdmissionNo')) {
      document.getElementById('sAdmissionNo').value = 'ADM-' + new Date().getFullYear() + '-' + String(count).padStart(3, '0');
    }
  }
  const modal = document.getElementById('studentModal');
  if (modal) modal.classList.add('show');
}

function closeStudentModal() {
  const modal = document.getElementById('studentModal');
  if (modal) modal.classList.remove('show');
  studentEditingId = null;
}

function saveStudent() {
  const form = document.getElementById('studentForm');
  if (form && !form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const students = getData(STORAGE_KEYS.students);
  const get = (id) => (document.getElementById(id)?.value || '').trim();
  const data = {
    name: get('sName'),
    fatherName: get('sFather'),
    guardianName: get('sFather'),
    admissionNo: get('sAdmissionNo'),
    rollNo: get('sRollNo'),
    className: get('sClass'),
    section: get('sSection'),
    gender: get('sGender'),
    dob: get('sDob'),
    phone: get('sPhone'),
    whatsapp: get('sWhatsapp'),
    altPhone: get('sAltPhone'),
    admissionDate: get('sAdmissionDate'),
    bloodGroup: get('sBlood'),
    status: get('sStatus') || 'active',
    address: get('sAddress'),
    previousSchool: get('sPrevSchool'),
    emergencyContact: get('sEmergency'),
    photo: ''
  };

  if (studentEditingId) {
    const idx = students.findIndex(s => s.id === studentEditingId);
    if (idx !== -1) {
      students[idx] = { ...students[idx], ...data };
      logActivity('Update Student', data.name);
      showToast('Student updated successfully');
    }
  } else {
    if (students.some(s => s.admissionNo === data.admissionNo)) {
      showToast('Admission number already exists', 'error');
      return;
    }
    data.id = generateId('STU');
    students.push(data);
    logActivity('Add Student', data.name);
    showToast('Student added successfully');
  }
  setData(STORAGE_KEYS.students, students);
  closeStudentModal();
  renderStudents();
}

function editStudent(id) { openStudentModal(id); }

function deleteStudent(id) {
  confirmModal('Delete Student', 'Are you sure you want to delete this student?', () => {
    let students = getData(STORAGE_KEYS.students);
    const s = students.find(x => x.id === id);
    students = students.filter(x => x.id !== id);
    setData(STORAGE_KEYS.students, students);
    logActivity('Delete Student', s ? s.name : id);
    showToast('Student deleted');
    renderStudents();
  });
}

function viewStudent(id) {
  const s = getData(STORAGE_KEYS.students).find(x => x.id === id);
  if (!s) return;
  const photo = s.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=1e3a5f&color=fff&size=128`;
  const body = document.getElementById('viewBody');
  if (!body) return;
  body.innerHTML = `
    <div class="profile-header" style="margin-bottom:20px">
      <img src="${photo}" alt="">
      <div>
        <h2>${s.name}</h2>
        <p>${s.admissionNo} &bull; ${s.className} - ${s.section}</p>
        <p><span class="badge badge-${s.status === 'active' ? 'success' : 'danger'}">${s.status}</span></p>
      </div>
    </div>
    <div class="form-row">
      <div><strong>Father/Guardian:</strong><br>${s.fatherName || '-'}</div>
      <div><strong>Gender:</strong><br>${s.gender || '-'}</div>
      <div><strong>Date of Birth:</strong><br>${formatDate(s.dob)}</div>
      <div><strong>Roll No:</strong><br>${s.rollNo || '-'}</div>
      <div><strong>Phone:</strong><br>${s.phone || '-'}</div>
      <div><strong>WhatsApp:</strong><br>${s.whatsapp || '-'} ${s.whatsapp ? `<button class="wa-btn" onclick="openWhatsApp('${s.whatsapp}')"><i class="fab fa-whatsapp"></i></button>` : ''}</div>
      <div><strong>Admission Date:</strong><br>${formatDate(s.admissionDate)}</div>
      <div><strong>Blood Group:</strong><br>${s.bloodGroup || '-'}</div>
      <div style="grid-column:1/-1"><strong>Address:</strong><br>${s.address || '-'}</div>
    </div>`;
  const modal = document.getElementById('viewModal');
  if (modal) modal.classList.add('show');
}

function printStudentProfile() {
  window.print();
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('studentsBody')) initStudents();
});
