/**
 * Exams Module
 * THE KNOWLEDGE HUB PUBLIC SCHOOL
 */

function initExams() {
  if (typeof initPage === 'function') {
    initPage('exams');
  } else {
    const session = requireAuth(['admin', 'teacher', 'student', 'parent']);
    if (!session) return;
    renderLayout('exams');
    renderExamsList();
  }
}

function renderExamsList() {
  let list = getData(STORAGE_KEYS.exams);
  const q = (document.getElementById('searchInput')?.value || '').toLowerCase();
  if (q) list = list.filter(e => JSON.stringify(e).toLowerCase().includes(q));

  const container = document.getElementById('listContainer');
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-file-alt"></i>
        <h3>No exams yet</h3>
        <p>Click Add New to create an exam schedule</p>
        <p class="mt-2"><a href="results.html" class="btn btn-outline btn-sm">Go to Results / Marks Entry</a></p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="mb-3">
      <a href="results.html" class="btn btn-primary btn-sm"><i class="fas fa-edit"></i> Enter Marks / Results</a>
    </div>
    <div class="table-responsive"><table class="table">
      <thead><tr>
        <th>Exam Name</th><th>Class</th><th>Subject</th><th>Date</th><th>Total Marks</th><th class="no-print">Actions</th>
      </tr></thead>
      <tbody>
        ${list.map(e => `<tr>
          <td class="fw-bold">${e.name || '-'}</td>
          <td>${e.className || '-'}</td>
          <td>${e.subject || '-'}</td>
          <td>${formatDate(e.date)}</td>
          <td>${e.totalMarks || '-'}</td>
          <td class="no-print"><div class="action-btns">
            <button class="btn btn-icon btn-outline" onclick="typeof openAddModal==='function'&&openAddModal('${e.id}')"><i class="fas fa-edit"></i></button>
            <button class="btn btn-icon btn-outline" onclick="deleteExam('${e.id}')"><i class="fas fa-trash text-danger"></i></button>
          </div></td>
        </tr>`).join('')}
      </tbody>
    </table></div>`;
}

function deleteExam(id) {
  confirmModal('Delete Exam', 'Are you sure?', () => {
    setData(STORAGE_KEYS.exams, getData(STORAGE_KEYS.exams).filter(x => x.id !== id));
    showToast('Exam deleted');
    if (typeof renderList === 'function') renderList();
    else renderExamsList();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('exams.html')) initExams();
});
