/**
 * Parents Module
 * THE SMART MODERN PUBLIC SCHOOL
 */

function initParents() {
  if (typeof initPage === 'function') {
    initPage('parents');
  } else {
    const session = requireAuth(['admin', 'parent']);
    if (!session) return;
    renderLayout('parents');
    renderParentsList();
  }
}

function renderParentsList() {
  let list = getData(STORAGE_KEYS.parents);
  const q = (document.getElementById('searchInput')?.value || '').toLowerCase();
  if (q) list = list.filter(p => JSON.stringify(p).toLowerCase().includes(q));

  const container = document.getElementById('listContainer');
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = '<div class="empty-state"><i class="fas fa-users"></i><h3>No parents found</h3></div>';
    return;
  }

  container.innerHTML = `
    <div class="table-responsive"><table class="table">
      <thead><tr>
        <th>Name</th><th>Relation</th><th>Phone</th><th>WhatsApp</th><th>Email</th><th>Status</th><th class="no-print">Actions</th>
      </tr></thead>
      <tbody>
        ${list.map(p => `<tr>
          <td class="fw-bold">${p.name}</td>
          <td>${p.relation || '-'}</td>
          <td>${p.phone || '-'}</td>
          <td>${p.whatsapp ? `<button class="wa-btn" onclick="openWhatsApp('${p.whatsapp}')"><i class="fab fa-whatsapp"></i></button> ${p.whatsapp}` : '-'}</td>
          <td>${p.email || '-'}</td>
          <td><span class="badge badge-${p.status === 'active' ? 'success' : 'danger'}">${p.status || 'active'}</span></td>
          <td class="no-print"><div class="action-btns">
            <button class="btn btn-icon btn-outline" onclick="editParent('${p.id}')"><i class="fas fa-edit"></i></button>
            <button class="btn btn-icon btn-outline" onclick="deleteParent('${p.id}')"><i class="fas fa-trash text-danger"></i></button>
          </div></td>
        </tr>`).join('')}
      </tbody>
    </table></div>`;
}

function editParent(id) {
  if (typeof openAddModal === 'function') openAddModal(id);
}

function deleteParent(id) {
  confirmModal('Delete Parent', 'Are you sure?', () => {
    setData(STORAGE_KEYS.parents, getData(STORAGE_KEYS.parents).filter(x => x.id !== id));
    showToast('Parent deleted');
    if (typeof renderList === 'function') renderList();
    else renderParentsList();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('parents')) initParents();
});
