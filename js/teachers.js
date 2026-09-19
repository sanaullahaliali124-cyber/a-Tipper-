/**
 * Teachers Module
 * THE SMART MODERN PUBLIC SCHOOL
 */

let teacherEditingId = null;

function initTeachers() {
  const session = requireAuth(['admin']);
  if (!session) return;
  renderLayout('teachers');
  renderTeachers();
}

function renderTeachers() {
  let list = getData(STORAGE_KEYS.teachers);
  const q = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const st = document.getElementById('filterStatus')?.value || '';
  list = list.filter(t => {
    if (q && !(t.name + t.teacherId + t.subject + t.phone).toLowerCase().includes(q)) return false;
    if (st && t.status !== st) return false;
    return true;
  });

  const tbody = document.getElementById('teachersBody');
  if (!tbody) return;
  tbody.innerHTML = list.map(t => {
    const photo = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=28a745&color=fff&size=72`;
    return `<tr>
      <td><img class="avatar" src="${photo}"></td>
      <td>${t.teacherId}</td>
      <td class="fw-bold">${t.name}</td>
      <td>${t.subject || '-'}</td>
      <td>${(t.classes || []).join(', ') || '-'}</td>
      <td>${t.phone || '-'}</td>
      <td>${t.whatsapp ? `<button class="wa-btn" onclick="openWhatsApp('${t.whatsapp}')"><i class="fab fa-whatsapp"></i></button>` : '-'}</td>
      <td><span class="badge badge-${t.status === 'active' ? 'success' : 'danger'}">${t.status}</span></td>
      <td class="no-print"><div class="action-btns">
        <button class="btn btn-icon btn-outline" onclick="editTeacher('${t.id}')"><i class="fas fa-edit"></i></button>
        <button class="btn btn-icon btn-outline" onclick="deleteTeacher('${t.id}')"><i class="fas fa-trash text-danger"></i></button>
      </div></td>
    </tr>`;
  }).join('') || '<tr><td colspan="9" class="text-muted" style="text-align:center;padding:30px">No teachers found</td></tr>';
}

function openTeacherModal(id = null) {
  teacherEditingId = id;
  const title = document.getElementById('modalTitle');
  if (title) title.textContent = id ? 'Edit Teacher' : 'Add Teacher';
  const form = document.getElementById('teacherForm');
  if (form) form.reset();

  if (id) {
    const t = getData(STORAGE_KEYS.teachers).find(x => x.id === id);
    if (t) {
      const set = (elId, v) => { const el = document.getElementById(elId); if (el) el.value = v || ''; };
      set('tId', t.id);
      set('tName', t.name);
      set('tTeacherId', t.teacherId);
      set('tSubject', t.subject);
      set('tQual', t.qualification);
      set('tPhone', t.phone);
      set('tWhatsapp', t.whatsapp);
      set('tEmail', t.email);
      set('tJoin', t.joiningDate);
      set('tSalary', t.salary);
      set('tStatus', t.status || 'active');
      set('tAddress', t.address);
    }
  } else {
    const n = getData(STORAGE_KEYS.teachers).length + 1001;
    if (document.getElementById('tTeacherId')) document.getElementById('tTeacherId').value = 'T-' + n;
    if (document.getElementById('tJoin')) document.getElementById('tJoin').value = today();
  }
  const modal = document.getElementById('teacherModal');
  if (modal) modal.classList.add('show');
}

function closeTeacherModal() {
  const modal = document.getElementById('teacherModal');
  if (modal) modal.classList.remove('show');
  teacherEditingId = null;
}

function saveTeacher() {
  const form = document.getElementById('teacherForm');
  if (form && !form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const list = getData(STORAGE_KEYS.teachers);
  const get = (id) => (document.getElementById(id)?.value || '').trim();
  const data = {
    name: get('tName'),
    teacherId: get('tTeacherId'),
    subject: get('tSubject'),
    qualification: get('tQual'),
    phone: get('tPhone'),
    whatsapp: get('tWhatsapp'),
    email: get('tEmail'),
    joiningDate: get('tJoin'),
    salary: Number(get('tSalary')) || 0,
    status: get('tStatus') || 'active',
    address: get('tAddress'),
    classes: [],
    password: 'teacher123'
  };

  if (teacherEditingId) {
    const i = list.findIndex(x => x.id === teacherEditingId);
    if (i !== -1) {
      list[i] = { ...list[i], ...data };
      showToast('Teacher updated');
    }
  } else {
    data.id = generateId('TCH');
    list.push(data);
    showToast('Teacher added');
  }
  setData(STORAGE_KEYS.teachers, list);
  logActivity(teacherEditingId ? 'Update Teacher' : 'Add Teacher', data.name);
  closeTeacherModal();
  renderTeachers();
}

function editTeacher(id) { openTeacherModal(id); }

function deleteTeacher(id) {
  confirmModal('Delete Teacher', 'Are you sure?', () => {
    setData(STORAGE_KEYS.teachers, getData(STORAGE_KEYS.teachers).filter(x => x.id !== id));
    showToast('Teacher deleted');
    renderTeachers();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('teachersBody')) initTeachers();
});
