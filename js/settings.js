/**
 * Settings - THE KNOWLEDGE HUB PUBLIC SCHOOL
 * Profile photo + School Logo: Add / Change / Remove
 */

function initSettings() {
  var session = requireAuth(['admin']);
  if (!session) return;
  renderLayout('settings');

  var container = document.getElementById('listContainer');
  if (!container) return;

  var s = getSettings();
  var photo = session.photo || ('https://ui-avatars.com/api/?name=' + encodeURIComponent(session.name || 'Admin') + '&background=1e3a5f&color=fff&size=128');
  var logoSrc = s.logo || 'assets/logo/school-logo.png';

  container.innerHTML =
    '<div class="card mb-3">' +
      '<div class="card-header"><h2><i class="fas fa-image"></i> School Logo</h2></div>' +
      '<div class="card-body">' +
        '<div class="d-flex align-center gap-3" style="flex-wrap:wrap">' +
          '<img id="logoPreview" src="' + logoSrc + '" alt="School Logo" ' +
            'style="width:90px;height:90px;border-radius:12px;object-fit:contain;background:#fff;padding:4px;border:2px solid #e9ecef" ' +
            'onerror="this.src=\'assets/logo/school-logo.png\'">' +
          '<div>' +
            '<p class="text-muted" style="margin-bottom:12px;font-size:0.9rem">Sidebar (left of school name), login, header</p>' +
            '<div class="d-flex gap-2" style="flex-wrap:wrap">' +
              '<label class="btn btn-primary btn-sm" style="cursor:pointer;margin:0">' +
                '<i class="fas fa-plus"></i> Add Logo' +
                '<input type="file" id="logoInput" accept="image/*" style="display:none" onchange="handleLogoUpload(event)">' +
              '</label>' +
              '<label class="btn btn-outline btn-sm" style="cursor:pointer;margin:0">' +
                '<i class="fas fa-sync"></i> Change Logo' +
                '<input type="file" id="logoInput2" accept="image/*" style="display:none" onchange="handleLogoUpload(event)">' +
              '</label>' +
              '<button type="button" class="btn btn-outline btn-sm" onclick="removeSchoolLogo()">' +
                '<i class="fas fa-trash"></i> Remove Logo' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<div class="card mb-3">' +
      '<div class="card-header"><h2><i class="fas fa-user-circle"></i> Profile Photo</h2></div>' +
      '<div class="card-body">' +
        '<div class="d-flex align-center gap-3" style="flex-wrap:wrap">' +
          '<img id="profilePreview" src="' + photo + '" alt="Profile" ' +
            'style="width:90px;height:90px;border-radius:50%;object-fit:cover;border:3px solid #1e3a5f;background:#fff">' +
          '<div>' +
            '<div class="d-flex gap-2" style="flex-wrap:wrap">' +
              '<label class="btn btn-primary btn-sm" style="cursor:pointer;margin:0">' +
                '<i class="fas fa-plus"></i> Add / Change Photo' +
                '<input type="file" id="profilePhotoInput" accept="image/*" style="display:none" onchange="handleProfilePhoto(event)">' +
              '</label>' +
              '<button type="button" class="btn btn-outline btn-sm" onclick="removeProfilePhoto()">' +
                '<i class="fas fa-trash"></i> Remove Photo' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<form id="settingsForm" onsubmit="saveSettingsForm(event)">' +
      '<h3 style="margin-bottom:16px;color:#0f2744">School Settings</h3>' +
      '<div class="form-row">' +
        '<div><label class="form-label">School Name</label>' +
          '<input type="text" class="form-control" id="setName" value="' + (s.schoolName || 'THE KNOWLEDGE HUB PUBLIC SCHOOL').replace(/"/g, '&quot;') + '"></div>' +
        '<div><label class="form-label">Phone</label>' +
          '<input type="text" class="form-control" id="setPhone" value="' + (s.schoolPhone || '') + '"></div>' +
      '</div>' +
      '<div class="form-row">' +
        '<div><label class="form-label">WhatsApp Number</label>' +
          '<input type="text" class="form-control" id="setWa" value="' + (s.schoolWhatsapp || '03304886710') + '"></div>' +
        '<div><label class="form-label">Email</label>' +
          '<input type="email" class="form-control" id="setEmail" value="' + (s.schoolEmail || '') + '"></div>' +
      '</div>' +
      '<div class="form-row">' +
        '<div style="grid-column:1/-1"><label class="form-label">Address</label>' +
          '<textarea class="form-textarea" id="setAddress">' + (s.schoolAddress || '') + '</textarea></div>' +
      '</div>' +
      '<hr style="margin:24px 0;border:none;border-top:1px solid #e9ecef">' +
      '<h3 style="margin-bottom:16px;color:#0f2744">Change Password</h3>' +
      '<div class="form-row">' +
        '<div><label class="form-label">New Password</label>' +
          '<input type="password" class="form-control" id="setNewPass" placeholder="New password"></div>' +
        '<div><label class="form-label">Confirm Password</label>' +
          '<input type="password" class="form-control" id="setConfirmPass" placeholder="Confirm"></div>' +
      '</div>' +
      '<button type="submit" class="btn btn-primary mt-3"><i class="fas fa-save"></i> Save Settings</button>' +
    '</form>' +
    '<div class="mt-3 d-flex gap-2" style="flex-wrap:wrap">' +
      '<button class="btn btn-outline btn-sm" onclick="exportSettingsData()"><i class="fas fa-download"></i> Export Data</button>' +
      '<button class="btn btn-outline btn-sm" onclick="if(confirm(\'Reset all data?\')){localStorage.clear();location.reload()}"><i class="fas fa-redo"></i> Reset System</button>' +
    '</div>' +
    '<div class="card mt-3"><div class="card-body">' +
      '<h3 style="margin-bottom:12px">Activity Log</h3>' +
      '<div id="activityLogList" style="max-height:280px;overflow-y:auto"></div>' +
    '</div></div>';

  renderActivityLog();
}

function handleLogoUpload(e) {
  var file = e.target.files && e.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { showToast('Select an image file', 'error'); return; }
  var reader = new FileReader();
  reader.onload = function (ev) {
    var settings = getSettings();
    settings.logo = ev.target.result;
    saveSettings(settings);
    showToast('School logo added');
    logActivity('Logo', 'Logo added/changed');
    renderLayout('settings');
    initSettings();
  };
  reader.readAsDataURL(file);
}

function removeSchoolLogo() {
  confirmModal('Remove Logo', 'Remove school logo from sidebar and site?', function () {
    var settings = getSettings();
    settings.logo = 'assets/logo/school-logo.png';
    saveSettings(settings);
    showToast('Logo reset to default file');
    logActivity('Logo', 'Logo removed/reset');
    renderLayout('settings');
    initSettings();
  });
}

function handleProfilePhoto(e) {
  var file = e.target.files && e.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { showToast('Select an image file', 'error'); return; }
  if (file.size > 2 * 1024 * 1024) { showToast('Max 2MB', 'error'); return; }
  var reader = new FileReader();
  reader.onload = function (ev) {
    var session = getSession();
    if (!session) return;
    session.photo = ev.target.result;
    setSession(session);
    var users = getData(STORAGE_KEYS.users);
    var idx = users.findIndex(function (u) { return u.id === session.id || u.role === 'admin'; });
    if (idx !== -1) { users[idx].photo = ev.target.result; setData(STORAGE_KEYS.users, users); }
    showToast('Profile photo updated');
    initSettings();
  };
  reader.readAsDataURL(file);
}

function removeProfilePhoto() {
  confirmModal('Remove Photo', 'Remove profile photo?', function () {
    var session = getSession();
    if (!session) return;
    session.photo = '';
    setSession(session);
    var users = getData(STORAGE_KEYS.users);
    var idx = users.findIndex(function (u) { return u.id === session.id || u.role === 'admin'; });
    if (idx !== -1) { users[idx].photo = ''; setData(STORAGE_KEYS.users, users); }
    showToast('Profile photo removed');
    initSettings();
  });
}

function saveSettingsForm(e) {
  e.preventDefault();
  var settings = getSettings();
  settings.schoolName = document.getElementById('setName').value;
  settings.schoolPhone = document.getElementById('setPhone').value;
  settings.schoolWhatsapp = document.getElementById('setWa').value || '03304886710';
  settings.schoolEmail = document.getElementById('setEmail').value;
  settings.schoolAddress = document.getElementById('setAddress').value;
  if (!settings.logo) settings.logo = 'assets/logo/school-logo.png';
  saveSettings(settings);
  var newPass = document.getElementById('setNewPass').value;
  var confirmPass = document.getElementById('setConfirmPass').value;
  if (newPass) {
    if (newPass !== confirmPass) { showToast('Passwords do not match', 'error'); return; }
    var users = getData(STORAGE_KEYS.users);
    var admin = users.find(function (u) { return u.role === 'admin'; });
    if (admin) { admin.password = newPass; setData(STORAGE_KEYS.users, users); }
  }
  showToast('Settings saved');
  logActivity('Settings', 'Saved');
  renderLayout('settings');
}

function exportSettingsData() {
  var data = {};
  Object.values(STORAGE_KEYS).forEach(function (k) {
    if (k !== STORAGE_KEYS.session) data[k] = getData(k);
  });
  data.settings = getSettings();
  var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'school-backup.json';
  a.click();
  showToast('Exported');
}

function renderActivityLog() {
  var el = document.getElementById('activityLogList');
  if (!el) return;
  var logs = getData(STORAGE_KEYS.activityLog).slice(0, 25);
  if (!logs.length) { el.innerHTML = '<p class="text-muted">No activity yet</p>'; return; }
  el.innerHTML = logs.map(function (l) {
    return '<div style="padding:8px 0;border-bottom:1px solid #e9ecef;font-size:0.85rem">' +
      '<strong>' + l.action + '</strong> — ' + (l.details || '') +
      '<div class="text-muted">' + l.user + ' · ' + formatDate(l.timestamp) + '</div></div>';
  }).join('');
}

document.addEventListener('DOMContentLoaded', function () {
  if (window.location.pathname.indexOf('settings') !== -1) initSettings();
});
