/**
 * Staff Module
 * THE SMART MODERN PUBLIC SCHOOL
 */

function initStaff() {
  if (typeof initPage === 'function') {
    initPage('staff');
  } else {
    const session = requireAuth(['admin']);
    if (!session) return;
    renderLayout('staff');
    renderStaffList();
  }
}

function renderStaffList() {
  let list = getData(STORAGE_KEYS.staff);
  const q = (document.getElementById('searchInput')?.value || '').toLowerCase();
  if (q) list = list.filter(s => JSON.stringify(s).toLowerCase().includes(q));

  const container = document.getElementById('listContainer');
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = '<div class="empty-state"><i class="fas fa-user-tie"></i><h3>No staff found</h3></div>';
    return;
  }

  container.innerHTML = `
    <div class="table-responsive"><table class="table">
      <thead><tr>
        <th>Name</th><th>Staff ID</th><th>Category</th><th>Phone</th><th>WhatsApp</th><th>Salary</th><th>Status</th><th class="no-print">Actions</th>
      </tr></thead>
      <tbody>
        ${list.map(s => `<tr>
          <td class="fw-bold">${s.name}</td>
          <td>${s.staffId || '-'}</td>
          <td>${s.category || '-'}</td>
          <td>${s.phone || '-'}</td>
          <td>${s.whatsapp ? `<button class="wa-btn" onclick="openWhatsApp('${s.whatsapp}')"><i class="fab fa-whatsapp"></i></button> ${s.whatsapp}` : '-'}</td>
          <td>${s.salary ? formatCurrency(s.salary) : '-'}</td>
          <td><span class="badge badge-${s.status === 'active' ? 'success' : 'danger'}">${s.status || 'active'}</span></td>
          <td class="no-print"><div class="action-btns">
            <button class="btn btn-icon btn-outline" onclick="editStaff('${s.id}')"><i class="fas fa-edit"></i></button>
            <button class="btn btn-icon btn-outline" onclick="deleteStaff('${s.id}')"><i class="fas fa-trash text-danger"></i></button>
          </div></td>
        </tr>`).join('')}
      </tbody>
    </table></div>`;
}

function editStaff(id) {
  if (typeof openAddModal === 'function') openAddModal(id);
}

function deleteStaff(id) {
  confirmModal('Delete Staff', 'Are you sure?', () => {
    setData(STORAGE_KEYS.staff, getData(STORAGE_KEYS.staff).filter(x => x.id !== id));
    showToast('Staff deleted');
    if (typeof renderList === 'function') renderList();
    else renderStaffList();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('staff.html')) initStaff();
});
