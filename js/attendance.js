/**
 * Attendance Module
 * THE SMART MODERN PUBLIC SCHOOL
 */

function initAttendance() {
  const session = requireAuth(['admin', 'teacher', 'student', 'parent']);
  if (!session) return;
  renderLayout('attendance');

  const container = document.getElementById('listContainer');
  if (!container) return;

  const classes = getData(STORAGE_KEYS.classes);
  container.innerHTML = `
    <div class="filters-bar">
      <input type="date" class="form-control" id="attDate" value="${today()}" style="width:auto">
      <select class="form-select" id="attClass" style="width:auto">
        <option value="">Select Class</option>
        ${classes.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
      </select>
      <select class="form-select" id="attSection" style="width:auto">
        <option value="A">A</option>
        <option value="B">B</option>
      </select>
      <button class="btn btn-primary btn-sm" onclick="loadAttendance()"><i class="fas fa-sync"></i> Load</button>
      <button class="btn btn-success btn-sm" onclick="markAllPresent()">Mark All Present</button>
      <button class="btn btn-primary btn-sm" onclick="saveAttendance()"><i class="fas fa-save"></i> Save</button>
    </div>
    <div id="attTable"></div>`;
}

function loadAttendance() {
  const cls = document.getElementById('attClass')?.value;
  const sec = document.getElementById('attSection')?.value;
  const date = document.getElementById('attDate')?.value;
  if (!cls) {
    showToast('Select a class', 'warning');
    return;
  }
  const students = getData(STORAGE_KEYS.students).filter(s =>
    s.className === cls && s.section === sec && s.status === 'active'
  );
  const att = getData(STORAGE_KEYS.attendance);
  const existing = att.find(a => a.date === date && a.className === cls && a.section === sec && a.type === 'student');
  const records = {};
  if (existing && existing.records) {
    if (Array.isArray(existing.records)) {
      existing.records.forEach(r => { records[r.studentId] = r.status; });
    } else {
      Object.assign(records, existing.records);
    }
  }

  const table = document.getElementById('attTable');
  if (!table) return;
  table.innerHTML = students.length ? `
    <div class="table-responsive"><table class="table">
      <thead><tr><th>Roll</th><th>Name</th><th>Present</th><th>Absent</th><th>Late</th><th>Leave</th></tr></thead>
      <tbody>
        ${students.map(s => {
          const st = records[s.id] || 'present';
          return `<tr>
            <td>${s.rollNo || '-'}</td>
            <td class="fw-bold">${s.name}</td>
            <td><input type="radio" name="att_${s.id}" value="present" ${st === 'present' ? 'checked' : ''}></td>
            <td><input type="radio" name="att_${s.id}" value="absent" ${st === 'absent' ? 'checked' : ''}></td>
            <td><input type="radio" name="att_${s.id}" value="late" ${st === 'late' ? 'checked' : ''}></td>
            <td><input type="radio" name="att_${s.id}" value="leave" ${st === 'leave' ? 'checked' : ''}></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table></div>
    <p class="text-muted mt-2">Total students: ${students.length}</p>` :
    '<div class="empty-state"><h3>No students in this class/section</h3></div>';
}

function markAllPresent() {
  document.querySelectorAll('#attTable input[value="present"]').forEach(r => { r.checked = true; });
}

function saveAttendance() {
  const cls = document.getElementById('attClass')?.value;
  const sec = document.getElementById('attSection')?.value;
  const date = document.getElementById('attDate')?.value;
  if (!cls) return;

  const students = getData(STORAGE_KEYS.students).filter(s =>
    s.className === cls && s.section === sec && s.status === 'active'
  );
  const recordsMap = {};
  students.forEach(s => {
    const checked = document.querySelector(`input[name="att_${s.id}"]:checked`);
    recordsMap[s.id] = checked ? checked.value : 'present';
  });

  let att = getData(STORAGE_KEYS.attendance);
  const idx = att.findIndex(a => a.date === date && a.className === cls && a.section === sec && a.type === 'student');
  const entry = {
    id: idx >= 0 ? att[idx].id : generateId('ATT'),
    type: 'student',
    date,
    className: cls,
    section: sec,
    records: Object.entries(recordsMap).map(([sid, status]) => ({ studentId: sid, status })),
    markedBy: getSession()?.name || 'Admin',
    markedAt: new Date().toISOString()
  };
  if (idx >= 0) att[idx] = entry;
  else att.push(entry);
  setData(STORAGE_KEYS.attendance, att);
  showToast('Attendance saved successfully');
  logActivity('Attendance', `${cls}-${sec} on ${date}`);
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('listContainer') && window.location.pathname.includes('attendance')) {
    initAttendance();
  }
});
