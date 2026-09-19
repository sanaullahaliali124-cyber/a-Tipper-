/**
 * Fees Module
 * THE SMART MODERN PUBLIC SCHOOL
 */

let feeEditingId = null;

function initFees() {
  const session = requireAuth(['admin', 'student', 'parent']);
  if (!session) return;
  renderLayout('fees');

  if (session.role !== 'admin') {
    const btn = document.getElementById('addFeeBtn');
    if (btn) btn.style.display = 'none';
  }

  const students = getData(STORAGE_KEYS.students).filter(s => s.status === 'active');
  const sel = document.getElementById('fStudent');
  if (sel) {
    sel.innerHTML = '<option value="">Select student</option>' +
      students.map(s => `<option value="${s.id}" data-name="${s.name}" data-adm="${s.admissionNo}" data-class="${s.className}">${s.name} (${s.admissionNo})</option>`).join('');
  }
  if (document.getElementById('fMonth')) document.getElementById('fMonth').value = today().substring(0, 7);
  if (document.getElementById('fDate')) document.getElementById('fDate').value = today();

  renderFeeStats();
  renderFees();
}

function renderFeeStats() {
  const el = document.getElementById('feeStats');
  if (!el) return;
  const fees = getData(STORAGE_KEYS.fees);
  const month = today().substring(0, 7);
  const collected = fees.filter(f => f.status === 'paid' && f.month === month).reduce((s, f) => s + Number(f.paid || 0), 0);
  const pending = fees.filter(f => f.status === 'pending').reduce((s, f) => s + (Number(f.amount) - Number(f.paid || 0)), 0);
  el.innerHTML = `
    <div class="stat-card"><div class="stat-icon green"><i class="fas fa-check-circle"></i></div>
      <div class="stat-info"><h3>${formatCurrency(collected)}</h3><p>This Month Collected</p></div></div>
    <div class="stat-card"><div class="stat-icon red"><i class="fas fa-clock"></i></div>
      <div class="stat-info"><h3>${formatCurrency(pending)}</h3><p>Pending Fees</p></div></div>
    <div class="stat-card"><div class="stat-icon blue"><i class="fas fa-file-invoice"></i></div>
      <div class="stat-info"><h3>${fees.length}</h3><p>Total Records</p></div></div>`;
}

function renderFees() {
  let fees = getData(STORAGE_KEYS.fees);
  const session = getSession();
  if (session.role === 'student') fees = fees.filter(f => f.studentId === session.id);
  else if (session.role === 'parent') {
    const parent = getData(STORAGE_KEYS.parents).find(p => p.id === session.id);
    const ids = parent?.studentIds || [];
    fees = fees.filter(f => ids.includes(f.studentId));
  }

  const q = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const st = document.getElementById('filterStatus')?.value || '';
  const ty = document.getElementById('filterType')?.value || '';
  fees = fees.filter(f => {
    if (q && !(f.studentName + f.admissionNo + (f.receiptNo || '')).toLowerCase().includes(q)) return false;
    if (st && f.status !== st) return false;
    if (ty && f.feeType !== ty) return false;
    return true;
  });

  const tbody = document.getElementById('feesBody');
  if (!tbody) return;
  tbody.innerHTML = fees.map(f => `<tr>
    <td>${f.receiptNo || '-'}</td>
    <td class="fw-bold">${f.studentName}<br><small class="text-muted">${f.admissionNo}</small></td>
    <td>${f.className || '-'}</td>
    <td>${f.feeType}</td>
    <td>${f.month || '-'}</td>
    <td>${formatCurrency(f.amount)}</td>
    <td>${formatCurrency(f.paid)}</td>
    <td><span class="badge badge-${f.status === 'paid' ? 'success' : f.status === 'pending' ? 'danger' : 'warning'}">${f.status}</span></td>
    <td>${formatDate(f.paymentDate)}</td>
    <td class="no-print"><div class="action-btns">
      ${getSession().role === 'admin' ? `<button class="btn btn-icon btn-outline" onclick="editFee('${f.id}')"><i class="fas fa-edit"></i></button>
      <button class="btn btn-icon btn-outline" onclick="deleteFee('${f.id}')"><i class="fas fa-trash text-danger"></i></button>` : ''}
      ${f.status === 'paid' ? `<button class="btn btn-icon btn-outline" onclick="printReceipt('${f.id}')"><i class="fas fa-print"></i></button>` : ''}
    </div></td>
  </tr>`).join('') || '<tr><td colspan="10" style="text-align:center;padding:24px" class="text-muted">No fee records</td></tr>';
}

function openFeeModal(id = null) {
  feeEditingId = id;
  const form = document.getElementById('feeForm');
  if (form) form.reset();
  if (document.getElementById('fMonth')) document.getElementById('fMonth').value = today().substring(0, 7);
  if (document.getElementById('fDate')) document.getElementById('fDate').value = today();
  if (document.getElementById('fStatus')) document.getElementById('fStatus').value = 'paid';

  if (id) {
    const f = getData(STORAGE_KEYS.fees).find(x => x.id === id);
    if (f) {
      const set = (elId, v) => { const el = document.getElementById(elId); if (el) el.value = v ?? ''; };
      set('feeId', f.id);
      set('fStudent', f.studentId);
      set('fType', f.feeType);
      set('fMonth', f.month || '');
      set('fAmount', f.amount);
      set('fDiscount', f.discount || 0);
      set('fPaid', f.paid || 0);
      set('fMethod', f.method || 'Cash');
      set('fStatus', f.status);
      set('fDate', f.paymentDate || '');
    }
  }
  const modal = document.getElementById('feeModal');
  if (modal) modal.classList.add('show');
}

function closeFeeModal() {
  const modal = document.getElementById('feeModal');
  if (modal) modal.classList.remove('show');
  feeEditingId = null;
}

function saveFee() {
  const form = document.getElementById('feeForm');
  if (form && !form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const sel = document.getElementById('fStudent');
  const opt = sel.options[sel.selectedIndex];
  const amount = Number(document.getElementById('fAmount').value);
  const paid = Number(document.getElementById('fPaid').value) || 0;
  const discount = Number(document.getElementById('fDiscount').value) || 0;
  let status = document.getElementById('fStatus').value;
  if (paid >= amount - discount) status = 'paid';
  else if (paid > 0) status = 'partial';
  else status = 'pending';

  const fees = getData(STORAGE_KEYS.fees);
  const data = {
    studentId: sel.value,
    studentName: opt.dataset.name,
    admissionNo: opt.dataset.adm,
    className: opt.dataset.class,
    feeType: document.getElementById('fType').value,
    month: document.getElementById('fMonth').value,
    amount, paid, discount, status,
    paymentDate: status !== 'pending' ? (document.getElementById('fDate').value || today()) : null,
    method: document.getElementById('fMethod').value,
    receiptNo: null
  };

  if (feeEditingId) {
    const i = fees.findIndex(x => x.id === feeEditingId);
    if (i !== -1) {
      data.receiptNo = fees[i].receiptNo || (status === 'paid' ? 'RCPT-' + Date.now().toString().slice(-6) : null);
      fees[i] = { ...fees[i], ...data };
      showToast('Fee updated');
    }
  } else {
    data.id = generateId('FEE');
    data.receiptNo = status === 'paid' ? 'RCPT-' + Date.now().toString().slice(-6) : null;
    fees.push(data);
    showToast('Fee record saved');
  }
  setData(STORAGE_KEYS.fees, fees);
  logActivity('Fee', data.studentName + ' - ' + data.feeType);
  closeFeeModal();
  renderFeeStats();
  renderFees();
}

function editFee(id) { openFeeModal(id); }

function deleteFee(id) {
  confirmModal('Delete Fee Record', 'Are you sure?', () => {
    setData(STORAGE_KEYS.fees, getData(STORAGE_KEYS.fees).filter(x => x.id !== id));
    showToast('Deleted');
    renderFeeStats();
    renderFees();
  });
}

function printReceipt(id) {
  const f = getData(STORAGE_KEYS.fees).find(x => x.id === id);
  if (!f) return;
  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head><title>Receipt</title>
    <style>body{font-family:sans-serif;padding:40px;max-width:480px;margin:auto}
    h1{color:#1e3a5f;font-size:1.15rem}.row{display:flex;justify-content:space-between;margin:8px 0}
    hr{border:none;border-top:1px solid #ddd;margin:16px 0}</style></head><body>
    <h1>THE SMART MODERN PUBLIC SCHOOL</h1><p>Fee Receipt</p><hr>
    <div class="row"><span>Receipt:</span><strong>${f.receiptNo}</strong></div>
    <div class="row"><span>Student:</span><strong>${f.studentName}</strong></div>
    <div class="row"><span>Adm No:</span><strong>${f.admissionNo}</strong></div>
    <div class="row"><span>Class:</span><strong>${f.className}</strong></div>
    <div class="row"><span>Type:</span><strong>${f.feeType}</strong></div>
    <div class="row"><span>Amount:</span><strong>Rs. ${Number(f.amount).toLocaleString()}</strong></div>
    <div class="row"><span>Paid:</span><strong>Rs. ${Number(f.paid).toLocaleString()}</strong></div>
    <div class="row"><span>Method:</span><strong>${f.method || '-'}</strong></div>
    <div class="row"><span>Date:</span><strong>${f.paymentDate || '-'}</strong></div>
    <hr><p style="text-align:center;color:#666;font-size:0.85rem">WhatsApp: 03304886710</p>
    <script>window.print()<\/script></body></html>`);
  w.document.close();
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('feesBody')) initFees();
});
