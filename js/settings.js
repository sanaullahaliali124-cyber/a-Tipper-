/**
 * Settings Module
 * THE KNOWLEDGE HUB PUBLIC SCHOOL
 * Profile photo: Add / Change / Remove
 */

function initSettings() {
  const session = requireAuth(['admin']);
  if (!session) return;
  renderLayout('settings');

  const container = document.getElementById('listContainer');
  if (!container) return;

  const s = getSettings();
  const photo = session.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(session.name) + '&background=1e3a5f&color=fff&size=128';
  const logoSrc = s.logo || 'assets/logo/school-logo.png';

  container.innerHTML = '
    <div class="card mb-3">
      <div class="card-header"><h2><i class="fas fa-user-circle"></i> Profile Photo</h2></div>
      <div class="card-body">
        <div class="d-flex align-center gap-3" style="flex-wrap:wrap">
          <img id="profilePreview" src="' + photo + '" alt="Profile"
            style="width:100px;height:100px;border-radius:50%;object-fit:cover;border:3px solid var(--primary);background:#fff">
          <div>
            <p class="text-muted" style="margin-bottom:10px;font-size:0.9rem">Add, change or remove your profile photo</p>
            <div class="d-flex gap-2" style="flex-wrap:wrap">
              <label class="btn btn-primary btn-sm" style="cursor:pointer;margin:0">
                <i class="fas fa-upload"></i> ' + (session.photo ? 'Change Photo' : 'Add Photo') + '
                <input type="file" id="profilePhotoInput" accept="image/*" style="display:none" onchange="handleProfilePhoto(event)">
              </label>
              <button type="button" class="btn btn-outline btn-sm" onclick="removeProfilePhoto()">
                <i class="fas fa-trash"></i> Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-header"><h2><i class="fas fa-image"></i> School Logo</h2></div>
      <div class="card-body">
        <div class="d-flex align-center gap-3" style="flex-wrap:wrap">
          <img id="logoPreview" src="' + logoSrc + '" alt="School Logo"
            style="width:80px;height:80px;border-radius:12px;object-fit:contain;background:#fff;padding:4px;border:2px solid var(--gray-light)"
            onerror="this.src=\'assets/logo/school-logo.png\'">
          <div>
            <p class="text-muted" style="margin-bottom:10px;font-size:0.9rem">Official logo (sidebar left of school name)</p>
            <label class="btn btn-outline btn-sm" style="cursor:pointer;margin:0">
              <i class="fas fa-upload"></i> Change Logo
              <input type="file" id="logoInput" accept="image/*" style="display:none" onchange="handleLogoUpload(event)">
            </label>
          </div>
        </div>
      </div>
    </div>

    <form id="settingsForm" onsubmit="saveSettingsForm(event)">
      <h3 style="margin-bottom:16px;color:var(--primary-dark)">School Settings</h3>
      <div class="form-row">
        <div>
          <label class="form-label">School Name</label>
          <input type="text" class="form-control" id="setName" value="' + (s.schoolName || 'THE KNOWLEDGE HUB PUBLIC SCHOOL') + '">
        </div>
        <div>
          <label class="form-label">Phone</label>
          <input type="text" class="form-control" id="setPhone" value="' + (s.schoolPhone || '') + '">
        </div>
      </div>
      <div class="form-row">
        <div>
          <label class="form-label">WhatsApp Number</label>
          <input type="text" class="form-control" id="setWa" value="' + (s.schoolWhatsapp || '03304886710') + '">
        </div>
        <div>
          <label class="form-label">Email</label>
          <input type="email" class="form-control" id="setEmail" value="' + (s.schoolEmail || '') + '">
        </div>
      </div>
      <div class="form-row">
        <div style="grid-column:1/-1">
          <label class="form-label">Address</label>
          <textarea class="form-textarea" id="setAddress">' + (s.schoolAddress || '') + '</textarea>
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
      <button class="btn btn-outline btn-sm" onclick="exportSettingsData()"><i class="fas fa-download"></i> Export All Data</button>
      <button class="btn btn-outline btn-sm" onclick="if(confirm(\'Reset all data?\')){localStorage.clear();location.reload()}">
        <i class="fas fa-redo"></i> Reset System
      </button>
    </div>
    <div class="card mt-3">
      <div class="card-body">
        <h3 style="margin-bottom:12px">Activity Log</h3>
        <div id="activityLogList" style="max-height:300px;overflow-y:auto"></div>
      </div>
    </div>';

  renderActivityLog();
}

function handleProfilePhoto(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { showToast('Please select an image file', 'error'); return; }
  if (file.size > 2 * 1024 * 1024) { showToast('Image must be under 2MB', 'error'); return; }
  const reader = new FileReader();
  reader.onload = function (ev) {
    const dataUrl = ev.target.result;
    const session = getSession();
    if (!session) return;
    session.photo = dataUrl;
    setSession(session);
    const users = getData(STORAGE_KEYS.users);
    const idx = users.findIndex(u => u.id === session.id || u.role === 'admin');
    if (idx !== -1) { users[idx].photo = dataUrl; setData(STORAGE_KEYS.users, users); }
    showToast('Profile photo updated');
    logActivity('Profile Photo', 'Photo changed');
    initSettings();
  };
  reader.readAsDataURL(file);
}

function removeProfilePhoto() {
  confirmModal('Remove Photo', 'Remove your profile photo?', function () {
    const session = getSession();
    if (!session) return;
    session.photo = '';
    setSession(session);
    const users = getData(STORAGE_KEYS.users);
    const idx = users.findIndex(u => u.id === session.id || u.role === 'admin');
    if (idx !== -1) { users[idx].photo = ''; setData(STORAGE_KEYS.users, users); }
    showToast('Profile photo removed');
    logActivity('Profile Photo', 'Photo removed');
    initSettings();
  });
}

function handleLogoUpload(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { showToast('Please select an image file', 'error'); return; }
  const reader = new FileReader();
  reader.onload = function (ev) {
    const settings = getSettings();
    settings.logo = ev.target.result;
    saveSettings(settings);
    showToast('School logo updated');
    logActivity('Logo', 'School logo changed');
    renderLayout('settings');
    initSettings();
  };
  reader.readAsDataURL(file);
}

function saveSettingsForm(e) {
  e.preventDefault();
  const settings = getSettings();
  settings.schoolName = document.getElementById('setName').value;
  settings.schoolPhone = document.getElementById('setPhone').value;
  settings.schoolWhatsapp = document.getElementById('setWa').value || '03304886710';
  settings.schoolEmail = document.getElementById('setEmail').value;
  settings.schoolAddress = document.getElementById('setAddress').value;
  if (!settings.logo) settings.logo = 'assets/logo/school-logo.png';
  saveSettings(settings);

  const newPass = document.getElementById('setNewPass').value;
  const confirmPass = document.getElementById('setConfirmPass').value;
  if (newPass) {
    if (newPass !== confirmPass) { showToast('Passwords do not match', 'error'); return; }
    const users = getData(STORAGE_KEYS.users);
    const admin = users.find(u => u.role === 'admin');
    if (admin) { admin.password = newPass; setData(STORAGE_KEYS.users, users); }
  }
  showToast('Settings saved');
  logActivity('Settings', 'Updated school settings');
  renderLayout('settings');
}

function exportSettingsData() {
  const data = {};
  Object.values(STORAGE_KEYS).forEach(function (k) {
    if (k !== STORAGE_KEYS.session) data[k] = getData(k);
  });
  data.settings = getSettings();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'tkhps-backup-' + today() + '.json';
  a.click();
  showToast('Data exported');
}

function renderActivityLog() {
  const el = document.getElementById('activityLogList');
  if (!el) return;
  const logs = getData(STORAGE_KEYS.activityLog).slice(0, 30);
  if (logs.length === 0) { el.innerHTML = '<p class="text-muted">No activity yet</p>'; return; }
  el.innerHTML = logs.map(function (l) {
    return '<div style="padding:8px 0;border-bottom:1px solid var(--gray-light);font-size:0.85rem">' +
      '<strong>' + l.action + '</strong> — ' + (l.details || '') +
      '<div class="text-muted">' + l.user + ' (' + l.role + ') · ' + formatDate(l.timestamp) + '</div></div>';
  }).join('');
}

document.addEventListener('DOMContentLoaded', function () {
  if (window.location.pathname.indexOf('settings') !== -1) initSettings();
});
