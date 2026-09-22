/**
 * Settings - All roles can edit own profile
 * Admin also gets school logo + school settings
 * THE KNOWLEDGE HUB PUBLIC SCHOOL
 */

function initSettings() {
  var session = requireAuth(['admin', 'teacher', 'student', 'parent', 'staff']);
  if (!session) return;
  renderLayout('settings');

  var container = document.getElementById('listContainer');
  if (!container) return;

  var isAdmin = session.role === 'admin';
  var s = getSettings();
  var photo = session.photo || ('https://ui-avatars.com/api/?name=' + encodeURIComponent(session.name || 'User') + '&background=1e3a5f&color=fff&size=128');
  var logoSrc = s.logo || 'assets/logo/school-logo.png';
  var profile = getRoleProfile(session);

  var html = '';

  // --- Own Profile Photo (ALL roles) ---
  html +=
    '<div class="card mb-3">' +
      '<div class="card-header"><h2><i class="fas fa-user-circle"></i> My Profile Photo</h2></div>' +
      '<div class="card-body">' +
        '<div class="d-flex align-center gap-3" style="flex-wrap:wrap">' +
          '<img id="profilePreview" src="' + photo + '" alt="Profile" ' +
            'style="width:90px;height:90px;border-radius:50%;object-fit:cover;border:3px solid #1e3a5f;background:#fff">' +
          '<div>' +
            '<p class="text-muted" style="margin-bottom:10px;font-size:0.85rem">Add, change or remove your photo</p>' +
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
    '</div>';

  // --- My Profile details (ALL roles) ---
  html +=
    '<div class="card mb-3">' +
      '<div class="card-header"><h2><i class="fas fa-id-card"></i> My Profile</h2></div>' +
      '<div class="card-body">' +
        '<form id="myProfileForm" onsubmit="saveMyProfile(event)">' +
          '<div class="form-row">' +
            '<div><label class="form-label">Full Name</label>' +
              '<input type="text" class="form-control" id="myName" value="' + esc(profile.name || session.name || '') + '" required></div>' +
            '<div><label class="form-label">Phone</label>' +
              '<input type="tel" class="form-control" id="myPhone" value="' + esc(profile.phone || session.phone || '') + '"></div>' +
          '</div>' +
          '<div class="form-row">' +
            '<div><label class="form-label">WhatsApp</label>' +
              '<input type="tel" class="form-control" id="myWhatsapp" value="' + esc(profile.whatsapp || profile.phone || '') + '"></div>' +
            '<div><label class="form-label">Email</label>' +
              '<input type="email" class="form-control" id="myEmail" value="' + esc(profile.email || session.email || '') + '"></div>' +
          '</div>' +
          '<div class="form-row">' +
            '<div style="grid-column:1/-1"><label class="form-label">Address</label>' +
              '<textarea class="form-textarea" id="myAddress" rows="2">' + esc(profile.address || '') + '</textarea></div>' +
          '</div>' +
          '<button type="submit" class="btn btn-primary btn-sm mt-2"><i class="fas fa-save"></i> Save My Profile</button>' +
        '</form>' +
      '</div>' +
    '</div>';

  // --- Change own password (ALL roles) ---
  html +=
    '<div class="card mb-3">' +
      '<div class="card-header"><h2><i class="fas fa-lock"></i> Change Password</h2></div>' +
      '<div class="card-body">' +
        '<form id="myPassForm" onsubmit="changeMyPassword(event)">' +
          '<div class="form-row">' +
            '<div><label class="form-label">New Password</label>' +
              '<input type="password" class="form-control" id="myNewPass" required minlength="4"></div>' +
            '<div><label class="form-label">Confirm Password</label>' +
              '<input type="password" class="form-control" id="myConfirmPass" required minlength="4"></div>' +
          '</div>' +
          '<button type="submit" class="btn btn-outline btn-sm mt-2"><i class="fas fa-key"></i> Update Password</button>' +
        '</form>' +
      '</div>' +
    '</div>';

  // --- Admin only: School Logo + School Settings ---
  if (isAdmin) {
    html +=
      '<div class="card mb-3">' +
        '<div class="card-header"><h2><i class="fas fa-image"></i> School Logo</h2></div>' +
        '<div class="card-body">' +
          '<div class="d-flex align-center gap-3" style="flex-wrap:wrap">' +
            '<img id="logoPreview" src="' + logoSrc + '" alt="Logo" ' +
              'style="width:90px;height:90px;border-radius:12px;object-fit:contain;background:#fff;padding:4px;border:2px solid #e9ecef" ' +
              'onerror="this.src=\'assets/logo/school-logo.png\'">' +
            '<div>' +
              '<p class="text-muted" style="margin-bottom:10px;font-size:0.85rem">Sidebar, login, header</p>' +
              '<div class="d-flex gap-2" style="flex-wrap:wrap">' +
                '<label class="btn btn-primary btn-sm" style="cursor:pointer;margin:0">' +
                  '<i class="fas fa-plus"></i> Add Logo' +
                  '<input type="file" accept="image/*" style="display:none" onchange="handleLogoUpload(event)">' +
                '</label>' +
                '<label class="btn btn-outline btn-sm" style="cursor:pointer;margin:0">' +
                  '<i class="fas fa-sync"></i> Change Logo' +
                  '<input type="file" accept="image/*" style="display:none" onchange="handleLogoUpload(event)">' +
                '</label>' +
                '<button type="button" class="btn btn-outline btn-sm" onclick="removeSchoolLogo()">' +
                  '<i class="fas fa-trash"></i> Remove Logo' +
                '</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    html +=
      '<div class="card mb-3">' +
        '<div class="card-header"><h2><i class="fas fa-school"></i> School Settings</h2></div>' +
        '<div class="card-body">' +
          '<form id="settingsForm" onsubmit="saveSettingsForm(event)">' +
            '<div class="form-row">' +
              '<div><label class="form-label">School Name</label>' +
                '<input type="text" class="form-control" id="setName" value="' + esc(s.schoolName || 'THE KNOWLEDGE HUB PUBLIC SCHOOL') + '"></div>' +
              '<div><label class="form-label">Phone</label>' +
                '<input type="text" class="form-control" id="setPhone" value="' + esc(s.schoolPhone || '') + '"></div>' +
            '</div>' +
            '<div class="form-row">' +
              '<div><label class="form-label">WhatsApp</label>' +
                '<input type="text" class="form-control" id="setWa" value="' + esc(s.schoolWhatsapp || '03304886710') + '"></div>' +
              '<div><label class="form-label">Email</label>' +
                '<input type="email" class="form-control" id="setEmail" value="' + esc(s.schoolEmail || '') + '"></div>' +
            '</div>' +
            '<div class="form-row">' +
              '<div style="grid-column:1/-1"><label class="form-label">Address</label>' +
                '<textarea class="form-textarea" id="setAddress">' + esc(s.schoolAddress || '') + '</textarea></div>' +
            '</div>' +
            '<button type="submit" class="btn btn-primary mt-2"><i class="fas fa-save"></i> Save School Settings</button>' +
          '</form>' +
          '<div class="mt-3 d-flex gap-2" style="flex-wrap:wrap">' +
            '<button type="button" class="btn btn-outline btn-sm" onclick="exportSettingsData()"><i class="fas fa-download"></i> Export Data</button>' +
            '<button type="button" class="btn btn-outline btn-sm" onclick="if(confirm(\'Reset all data?\')){localStorage.clear();location.reload()}"><i class="fas fa-redo"></i> Reset System</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  container.innerHTML = html;
}

function esc(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function getRoleProfile(session) {
  var role = session.role;
  var id = session.id;
  if (role === 'admin') {
    var users = getData(STORAGE_KEYS.users);
    return users.find(function (u) { return u.id === id || u.role === 'admin'; }) || session;
  }
  if (role === 'teacher') {
    return getData(STORAGE_KEYS.teachers).find(function (t) { return t.id === id; }) || session;
  }
  if (role === 'student') {
    return getData(STORAGE_KEYS.students).find(function (s) { return s.id === id; }) || session;
  }
  if (role === 'parent') {
    return getData(STORAGE_KEYS.parents).find(function (p) { return p.id === id; }) || session;
  }
  if (role === 'staff') {
    return getData(STORAGE_KEYS.staff).find(function (s) { return s.id === id; }) || session;
  }
  return session;
}

function saveRoleProfile(session, data) {
  var role = session.role;
  var id = session.id;
  if (role === 'admin') {
    var users = getData(STORAGE_KEYS.users);
    var i = users.findIndex(function (u) { return u.id === id || u.role === 'admin'; });
    if (i !== -1) { Object.assign(users[i], data); setData(STORAGE_KEYS.users, users); }
  } else if (role === 'teacher') {
    var list = getData(STORAGE_KEYS.teachers);
    var i = list.findIndex(function (t) { return t.id === id; });
    if (i !== -1) { Object.assign(list[i], data); setData(STORAGE_KEYS.teachers, list); }
  } else if (role === 'student') {
    var list = getData(STORAGE_KEYS.students);
    var i = list.findIndex(function (s) { return s.id === id; });
    if (i !== -1) { Object.assign(list[i], data); setData(STORAGE_KEYS.students, list); }
  } else if (role === 'parent') {
    var list = getData(STORAGE_KEYS.parents);
    var i = list.findIndex(function (p) { return p.id === id; });
    if (i !== -1) { Object.assign(list[i], data); setData(STORAGE_KEYS.parents, list); }
  } else if (role === 'staff') {
    var list = getData(STORAGE_KEYS.staff);
    var i = list.findIndex(function (s) { return s.id === id; });
    if (i !== -1) { Object.assign(list[i], data); setData(STORAGE_KEYS.staff, list); }
  }
  // update session
  session.name = data.name || session.name;
  session.phone = data.phone || session.phone;
  session.email = data.email || session.email;
  if (data.photo !== undefined) session.photo = data.photo;
  setSession(session);
}

function saveMyProfile(e) {
  e.preventDefault();
  var session = getSession();
  if (!session) return;
  var data = {
    name: document.getElementById('myName').value.trim(),
    phone: document.getElementById('myPhone').value.trim(),
    whatsapp: document.getElementById('myWhatsapp').value.trim(),
    email: document.getElementById('myEmail').value.trim(),
    address: document.getElementById('myAddress').value.trim()
  };
  if (!data.name) { showToast('Name required', 'error'); return; }
  saveRoleProfile(session, data);
  showToast('Profile saved');
  logActivity('Profile', session.role + ' updated profile');
  renderLayout('settings');
  initSettings();
}

function changeMyPassword(e) {
  e.preventDefault();
  var session = getSession();
  if (!session) return;
  var p1 = document.getElementById('myNewPass').value;
  var p2 = document.getElementById('myConfirmPass').value;
  if (p1 !== p2) { showToast('Passwords do not match', 'error'); return; }
  if (p1.length < 4) { showToast('Min 4 characters', 'error'); return; }

  var role = session.role;
  var id = session.id;
  if (role === 'admin') {
    var users = getData(STORAGE_KEYS.users);
    var i = users.findIndex(function (u) { return u.id === id || u.role === 'admin'; });
    if (i !== -1) { users[i].password = p1; setData(STORAGE_KEYS.users, users); }
  } else if (role === 'teacher') {
    var list = getData(STORAGE_KEYS.teachers);
    var i = list.findIndex(function (t) { return t.id === id; });
    if (i !== -1) { list[i].password = p1; setData(STORAGE_KEYS.teachers, list); }
  } else if (role === 'student') {
    var list = getData(STORAGE_KEYS.students);
    var i = list.findIndex(function (s) { return s.id === id; });
    if (i !== -1) { list[i].password = p1; setData(STORAGE_KEYS.students, list); }
  } else if (role === 'parent') {
    var list = getData(STORAGE_KEYS.parents);
    var i = list.findIndex(function (p) { return p.id === id; });
    if (i !== -1) { list[i].password = p1; setData(STORAGE_KEYS.parents, list); }
  } else if (role === 'staff') {
    var list = getData(STORAGE_KEYS.staff);
    var i = list.findIndex(function (s) { return s.id === id; });
    if (i !== -1) { list[i].password = p1; setData(STORAGE_KEYS.staff, list); }
  }
  showToast('Password updated');
  logActivity('Password', session.role + ' changed password');
  document.getElementById('myPassForm').reset();
}

function handleProfilePhoto(e) {
  var file = e.target.files && e.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { showToast('Select image', 'error'); return; }
  if (file.size > 2 * 1024 * 1024) { showToast('Max 2MB', 'error'); return; }
  var reader = new FileReader();
  reader.onload = function (ev) {
    var session = getSession();
    if (!session) return;
    saveRoleProfile(session, { photo: ev.target.result, name: session.name });
    showToast('Photo updated');
    initSettings();
  };
  reader.readAsDataURL(file);
}

function removeProfilePhoto() {
  confirmModal('Remove Photo', 'Remove your profile photo?', function () {
    var session = getSession();
    if (!session) return;
    saveRoleProfile(session, { photo: '', name: session.name });
    showToast('Photo removed');
    initSettings();
  });
}

function handleLogoUpload(e) {
  var file = e.target.files && e.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { showToast('Select image', 'error'); return; }
  var reader = new FileReader();
  reader.onload = function (ev) {
    var settings = getSettings();
    settings.logo = ev.target.result;
    saveSettings(settings);
    showToast('Logo updated');
    renderLayout('settings');
    initSettings();
  };
  reader.readAsDataURL(file);
}

function removeSchoolLogo() {
  confirmModal('Remove Logo', 'Reset school logo to default?', function () {
    var settings = getSettings();
    settings.logo = 'assets/logo/school-logo.png';
    saveSettings(settings);
    showToast('Logo reset');
    renderLayout('settings');
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
  showToast('School settings saved');
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

document.addEventListener('DOMContentLoaded', function () {
  if (window.location.pathname.indexOf('settings') !== -1) initSettings();
});
