/**
 * Settings Module
 * THE SMART MODERN PUBLIC SCHOOL
 */

function initSettings() {
  const session = requireAuth(['admin']);
  if (!session) return;
  renderLayout('settings');

  const container = document.getElementById('listContainer');
  if (!container) return;

  const s = getSettings();
  container.innerHTML = `
    <form id="settingsForm" onsubmit="saveSettingsForm(event)">
      <h3 style="margin-bottom:16px;color:var(--primary-dark)">School Settings</h3>
      <div class="form-row">
        <div>
          <label class="form-label">School Name</label>
          <input type="text" class="form-control" id="setName" value="${s.schoolName || ''}">
        </div>
        <div>
          <label class="form-label">Phone</label>
          <input type="text" class="form-control" id="setPhone" value="${s.schoolPhone || ''}">
        </div>
      </div>
      <div class="form-row">
        <div>
          <label class="form-label">WhatsApp Number</label>
          <input type="text" class="form-control" id="setWa" value="${s.schoolWhatsapp || '03304886710'}">
        </div>
        <div>
          <label class="form-label">Email</label>
          <input type="email" class="form-control" id="setEmail" value="${s.schoolEmail || ''}">
        </div>
      </div>
      <div class="form-row">
        <div style="grid-column:1/-1">
          <label class="form-label">Address</label>
          <textarea class="form-textarea" id="setAddress">${s.schoolAddress || ''}</textarea>
        </div>
      </div>
      <hr style="margin:24px 0;border:none;border-top:1px solid var(--gray-light)">
      <h3 style="margin-bottom:16px;color:var(--primary-dark)">Admin Account / Security</h3>
      <div class="form-row">
        <div>
          <label class="form-label">Change Password</label>
          <input type="password" class="form-control" id="setNewPass" placeholder="New password">
        </div>
        <div>
          <label class="form-label">Confirm Password</label>
          <input type="password" class="form-control" id="setConfirmPass" placeholder="Confirm">
        </div>
      </div>
      <button type="submit" class="btn btn-primary mt-3"><i class="fas fa-save"></i> Save Settings</button>
    </form>
    <div class="mt-3 d-flex gap-2" style="flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="exportSettingsData()"><i class="fas fa-download"></i> Export All Data (JSON)</button>
      <button class="btn btn-outline btn-sm" onclick="if(confirm('Reset all data to defaults?')){localStorage.clear();location.reload()}">
        <i class="fas fa-redo"></i> Reset System
      </button>
    </div>
    <div class="card mt-3">
      <div class="card-body">
        <h3 style="margin-bottom:12px">Activity Log</h3>
        <div id="activityLogList" style="max-height:300px;overflow-y:auto"></div>
      </div>
    </div>`;

  renderActivityLog();
}

function saveSettingsForm(e) {
  e.preventDefault();
  const settings = {
    schoolName: document.getElementById('setName').value,
    schoolPhone: document.getElementById('setPhone').value,
    schoolWhatsapp: document.getElementById('setWa').value || '03304886710',
    schoolEmail: document.getElementById('setEmail').value,
    schoolAddress: document.getElementById('setAddress').value,
    logo: (typeof SCHOOL !== 'undefined' ? SCHOOL.logo : 'assets/logo/logo.svg')
  };
  saveSettings(settings);

  const newPass = document.getElementById('setNewPass').value;
  const confirmPass = document.getElementById('setConfirmPass').value;
  if (newPass) {
    if (newPass !== confirmPass) {
      showToast('Passwords do not match', 'error');
      return;
    }
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

function exportSettingsData() {
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

function renderActivityLog() {
  const el = document.getElementById('activityLogList');
  if (!el) return;
  const logs = getData(STORAGE_KEYS.activityLog).slice(0, 30);
  if (logs.length === 0) {
    el.innerHTML = '<p class="text-muted">No activity yet</p>';
    return;
  }
  el.innerHTML = logs.map(l => `
    <div style="padding:8px 0;border-bottom:1px solid var(--gray-light);font-size:0.85rem">
      <strong>${l.action}</strong> — ${l.details || ''}
      <div class="text-muted">${l.user} (${l.role}) · ${formatDate(l.timestamp)} ${l.timestamp ? new Date(l.timestamp).toLocaleTimeString() : ''}</div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('settings')) initSettings();
});
