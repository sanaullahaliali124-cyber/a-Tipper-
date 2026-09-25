/**
 * Student ID Card Module
 * THE KNOWLEDGE HUB PUBLIC SCHOOL
 * Logo: assets/logo/school-logo.png (exact file)
 */

var currentPreviewStudent = null;
var currentCardSide = 'front';
var ACADEMIC_YEAR = '2026-27';
var SCHOOL_SLOGAN = 'Quest for Excellence';

function initIdCards() {
  var session = requireAuth(['admin', 'teacher']);
  if (!session) return;
  renderLayout('idcards');

  var classes = getData(STORAGE_KEYS.classes);
  var fc = document.getElementById('filterClass');
  var bc = document.getElementById('bulkClass');
  if (fc) {
    classes.forEach(function (c) {
      fc.innerHTML += '<option value="' + c.name + '">' + c.name + '</option>';
    });
  }
  if (bc) {
    classes.forEach(function (c) {
      bc.innerHTML += '<option value="' + c.name + '">' + c.name + '</option>';
    });
  }

  renderIdStats();
  renderIdList();
}

function getAcademicYear() {
  var s = getSettings();
  return s.academicYear || ACADEMIC_YEAR;
}

function studentPhotoUrl(s) {
  if (s.photo) return s.photo;
  return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(s.name || 'S') +
    '&background=2c5aa0&color=fff&size=200';
}

function logoUrl() {
  var s = getSettings();
  return s.logo || 'assets/logo/school-logo.png';
}

function schoolName() {
  var s = getSettings();
  return s.schoolName || 'THE KNOWLEDGE HUB PUBLIC SCHOOL';
}

function schoolWhatsApp() {
  var s = getSettings();
  return s.schoolWhatsapp || '03304886710';
}

function schoolPhone() {
  var s = getSettings();
  return s.schoolPhone || '03304886710';
}

function schoolAddress() {
  var s = getSettings();
  return s.schoolAddress || 'Main Campus, Pakistan';
}

/** Unique QR payload per student */
function buildQRPayload(s) {
  return JSON.stringify({
    type: 'TKHPS-ID',
    id: s.id,
    adm: s.admissionNo || '',
    name: s.name || '',
    class: s.className || '',
    section: s.section || '',
    year: getAcademicYear(),
    v: 1
  });
}

function getQRData(s) {
  // Stored override if regenerated
  if (s.qrCode) return s.qrCode;
  return buildQRPayload(s);
}

function renderIdStats() {
  var students = getData(STORAGE_KEYS.students);
  var active = students.filter(function (s) { return s.status === 'active'; }).length;
  var withPhoto = students.filter(function (s) { return !!s.photo; }).length;
  var el = document.getElementById('idStats');
  if (!el) return;
  el.innerHTML =
    '<div class="stat-card"><div class="stat-icon blue"><i class="fas fa-id-card"></i></div>' +
      '<div class="stat-info"><h3>' + students.length + '</h3><p>Total ID Cards</p></div></div>' +
    '<div class="stat-card"><div class="stat-icon green"><i class="fas fa-check-circle"></i></div>' +
      '<div class="stat-info"><h3>' + active + '</h3><p>Active Students</p></div></div>' +
    '<div class="stat-card"><div class="stat-icon orange"><i class="fas fa-camera"></i></div>' +
      '<div class="stat-info"><h3>' + withPhoto + '</h3><p>With Photo</p></div></div>' +
    '<div class="stat-card"><div class="stat-icon purple"><i class="fas fa-qrcode"></i></div>' +
      '<div class="stat-info"><h3>' + students.length + '</h3><p>QR Codes</p></div></div>';
}

function renderIdList() {
  var students = getData(STORAGE_KEYS.students);
  var q = (document.getElementById('searchInput') && document.getElementById('searchInput').value || '').toLowerCase();
  var fClass = document.getElementById('filterClass') && document.getElementById('filterClass').value || '';
  var fSec = document.getElementById('filterSection') && document.getElementById('filterSection').value || '';
  var fStatus = document.getElementById('filterStatus') && document.getElementById('filterStatus').value || '';

  students = students.filter(function (s) {
    if (q && !(s.name + (s.admissionNo || '') + (s.id || '') + (s.rollNo || '')).toLowerCase().includes(q)) return false;
    if (fClass && s.className !== fClass) return false;
    if (fSec && s.section !== fSec) return false;
    if (fStatus && s.status !== fStatus) return false;
    return true;
  });

  var tbody = document.getElementById('idCardsBody');
  if (!tbody) return;

  if (!students.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:28px" class="text-muted">No students found</td></tr>';
    return;
  }

  tbody.innerHTML = students.map(function (s) {
    var photo = studentPhotoUrl(s);
    return '<tr>' +
      '<td><img class="avatar" src="' + photo + '" alt=""></td>' +
      '<td class="fw-bold">' + (s.name || '-') + '</td>' +
      '<td>' + (s.admissionNo || '-') + '</td>' +
      '<td>' + (s.className || '-') + '</td>' +
      '<td>' + (s.section || '-') + '</td>' +
      '<td>' + (s.rollNo || '-') + '</td>' +
      '<td><span class="badge badge-' + (s.status === 'active' ? 'success' : 'danger') + '">' + (s.status || 'active') + '</span></td>' +
      '<td><div class="action-btns">' +
        '<button class="btn btn-icon btn-outline" title="Preview" onclick="previewCard(\'' + s.id + '\')"><i class="fas fa-eye"></i></button>' +
        '<button class="btn btn-icon btn-outline" title="Print" onclick="previewCard(\'' + s.id + '\');setTimeout(printSingleCard,400)"><i class="fas fa-print"></i></button>' +
        '<button class="btn btn-icon btn-outline" title="QR" onclick="previewCard(\'' + s.id + '\');setTimeout(function(){showCardSide(\'back\')},300)"><i class="fas fa-qrcode"></i></button>' +
        '<a class="btn btn-icon btn-outline" title="Edit Student" href="students.html"><i class="fas fa-edit"></i></a>' +
      '</div></td></tr>';
  }).join('');
}

function buildFrontHTML(s) {
  var logo = logoUrl();
  var photo = studentPhotoUrl(s);
  return '<div class="id-front">' +
    '<div class="id-front-header">' +
      '<img src="' + logo + '" alt="Logo" onerror="this.src=\'assets/logo/school-logo.png\'">' +
      '<div class="sch-info">' +
        '<div class="sch-name">' + schoolName() + '</div>' +
        '<div class="sch-slogan">' + SCHOOL_SLOGAN + '</div>' +
      '</div>' +
      '<span class="id-badge">STUDENT</span>' +
    '</div>' +
    '<div class="id-front-body">' +
      '<div class="id-photo-box"><img src="' + photo + '" alt="Student"></div>' +
      '<div class="id-details">' +
        '<div class="stu-name">' + (s.name || '-') + '</div>' +
        '<div class="row"><span class="lbl">ID</span><span class="val">' + (s.id || '-').substring(0, 14) + '</span></div>' +
        '<div class="row"><span class="lbl">Adm No</span><span class="val">' + (s.admissionNo || '-') + '</span></div>' +
        '<div class="row"><span class="lbl">Class</span><span class="val">' + (s.className || '-') + ' - ' + (s.section || '') + '</span></div>' +
        '<div class="row"><span class="lbl">Roll</span><span class="val">' + (s.rollNo || '-') + '</span></div>' +
        '<div class="row"><span class="lbl">DOB</span><span class="val">' + formatDate(s.dob) + '</span></div>' +
        (s.bloodGroup ? '<div class="row"><span class="lbl">Blood</span><span class="val">' + s.bloodGroup + '</span></div>' : '') +
      '</div>' +
    '</div>' +
    '<div class="id-front-footer">' +
      '<span>Year: ' + getAcademicYear() + '</span>' +
      '<span>' + (s.status === 'active' ? 'ACTIVE' : 'INACTIVE') + '</span>' +
    '</div>' +
  '</div>';
}

function buildBackHTML(s, qrContainerId) {
  var logo = logoUrl();
  var emergency = s.emergencyContact || s.altPhone || s.phone || '-';
  var parentPhone = s.phone || s.whatsapp || '-';
  return '<div class="id-back">' +
    '<div class="id-back-header">' +
      '<img src="' + logo + '" alt="Logo" onerror="this.src=\'assets/logo/school-logo.png\'">' +
      '<div class="sch-name">' + schoolName() + '</div>' +
    '</div>' +
    '<div class="id-back-body">' +
      '<div class="id-back-info">' +
        '<div><strong>Address:</strong> ' + schoolAddress() + '</div>' +
        '<div><strong>Phone:</strong> ' + schoolPhone() + '</div>' +
        '<div><strong>WhatsApp:</strong> ' + schoolWhatsApp() + '</div>' +
        '<div><strong>Parent/Guardian:</strong> ' + (s.fatherName || s.guardianName || '-') + '</div>' +
        '<div><strong>Contact:</strong> ' + parentPhone + '</div>' +
        '<div><strong>Emergency:</strong> ' + emergency + '</div>' +
        '<div><strong>Valid:</strong> ' + getAcademicYear() + '</div>' +
      '</div>' +
      '<div class="id-qr-box" id="' + qrContainerId + '"></div>' +
    '</div>' +
    '<div class="id-back-rules">' +
      'This card is property of the school. If found, please return to school office. ' +
      'Misuse of this card is prohibited. Carry this card during school hours.' +
    '</div>' +
    '<div class="id-back-footer">WhatsApp: ' + schoolWhatsApp() + ' &nbsp;|&nbsp; ' + SCHOOL_SLOGAN + '</div>' +
  '</div>';
}

function renderQRInto(containerId, payload) {
  var el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';
  if (typeof QRCode === 'undefined') {
    el.innerHTML = '<span style="font-size:8px;text-align:center">QR lib missing</span>';
    return;
  }
  try {
    new QRCode(el, {
      text: payload,
      width: 70,
      height: 70,
      colorDark: '#0f2744',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  } catch (err) {
    el.innerHTML = '<span style="font-size:8px">QR error</span>';
  }
}

function previewCard(studentId) {
  var s = getData(STORAGE_KEYS.students).find(function (x) { return x.id === studentId; });
  if (!s) { showToast('Student not found', 'error'); return; }
  currentPreviewStudent = s;
  currentCardSide = 'front';

  document.getElementById('idCardFront').innerHTML = buildFrontHTML(s);
  document.getElementById('idCardBack').innerHTML = buildBackHTML(s, 'previewQR');
  document.getElementById('idCardFront').classList.remove('hidden');
  document.getElementById('idCardBack').classList.add('hidden');
  document.getElementById('tabFront').className = 'btn btn-sm btn-primary';
  document.getElementById('tabBack').className = 'btn btn-sm btn-outline';

  document.getElementById('previewModal').classList.add('show');

  setTimeout(function () {
    renderQRInto('previewQR', getQRData(s));
  }, 50);
}

function showCardSide(side) {
  currentCardSide = side;
  var front = document.getElementById('idCardFront');
  var back = document.getElementById('idCardBack');
  if (side === 'front') {
    front.classList.remove('hidden');
    back.classList.add('hidden');
    document.getElementById('tabFront').className = 'btn btn-sm btn-primary';
    document.getElementById('tabBack').className = 'btn btn-sm btn-outline';
  } else {
    front.classList.add('hidden');
    back.classList.remove('hidden');
    document.getElementById('tabFront').className = 'btn btn-sm btn-outline';
    document.getElementById('tabBack').className = 'btn btn-sm btn-primary';
    if (currentPreviewStudent) {
      renderQRInto('previewQR', getQRData(currentPreviewStudent));
    }
  }
}

function closePreview() {
  document.getElementById('previewModal').classList.remove('show');
  currentPreviewStudent = null;
}

function regenerateQR() {
  if (!currentPreviewStudent) return;
  var students = getData(STORAGE_KEYS.students);
  var idx = students.findIndex(function (x) { return x.id === currentPreviewStudent.id; });
  if (idx === -1) return;
  var payload = buildQRPayload(students[idx]);
  // Force unique by adding timestamp token
  var data = JSON.parse(payload);
  data.t = Date.now();
  students[idx].qrCode = JSON.stringify(data);
  setData(STORAGE_KEYS.students, students);
  currentPreviewStudent = students[idx];
  renderQRInto('previewQR', students[idx].qrCode);
  showCardSide('back');
  showToast('QR Code regenerated');
  logActivity('ID Card QR', currentPreviewStudent.name);
}

function printSingleCard() {
  if (!currentPreviewStudent) {
    showToast('Open a card preview first', 'warning');
    return;
  }
  var s = currentPreviewStudent;
  var area = document.getElementById('printArea');
  area.innerHTML =
    '<div class="print-card-pair">' +
      '<div class="id-card-face" id="printFront">' + buildFrontHTML(s) + '</div>' +
      '<div class="id-card-face" id="printBackWrap">' + buildBackHTML(s, 'printQR') + '</div>' +
    '</div>';
  area.classList.add('print-only');
  setTimeout(function () {
    renderQRInto('printQR', getQRData(s));
    setTimeout(function () {
      window.print();
    }, 200);
  }, 50);
}

function downloadCardImage() {
  // Browser print-to-PDF is the reliable method without heavy libs
  showToast('Use Print → Save as PDF to download', 'info');
  printSingleCard();
}

function openBulkModal() {
  document.getElementById('bulkModal').classList.add('show');
}

function printBulkCards() {
  var fClass = document.getElementById('bulkClass').value;
  var fSec = document.getElementById('bulkSection').value;
  var students = getData(STORAGE_KEYS.students).filter(function (s) {
    if (s.status !== 'active') return false;
    if (fClass && s.className !== fClass) return false;
    if (fSec && s.section !== fSec) return false;
    return true;
  });
  if (!students.length) {
    showToast('No active students for this filter', 'warning');
    return;
  }
  document.getElementById('bulkModal').classList.remove('show');

  var area = document.getElementById('printArea');
  var html = '<div class="print-cards-grid">';
  students.forEach(function (s, i) {
    var qid = 'bulkQR_' + i;
    html += '<div class="print-card-pair">' +
      '<div class="id-card-face">' + buildFrontHTML(s) + '</div>' +
      '<div class="id-card-face">' + buildBackHTML(s, qid) + '</div>' +
    '</div>';
  });
  html += '</div>';
  area.innerHTML = html;
  area.classList.add('print-only');

  setTimeout(function () {
    students.forEach(function (s, i) {
      renderQRInto('bulkQR_' + i, getQRData(s));
    });
    setTimeout(function () { window.print(); }, 300);
  }, 80);

  showToast(students.length + ' ID cards ready to print');
  logActivity('Bulk ID Cards', students.length + ' cards');
}

document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('idCardsBody')) initIdCards();
});
