/**
 * THE SMART MODERN PUBLIC SCHOOL - Core Application
 * Data layer with LocalStorage persistence
 */

const SCHOOL = {
  name: 'THE SMART MODERN PUBLIC SCHOOL',
  shortName: 'SMPS',
  whatsapp: '03304886710',
  whatsappIntl: '923304886710',
  phone: '03304886710',
  email: 'info@smartmodern.edu.pk',
  address: 'Main Campus, Pakistan',
  logo: 'assets/logo/logo.svg'
};

const STORAGE_KEYS = {
  users: 'smps_users',
  students: 'smps_students',
  teachers: 'smps_teachers',
  parents: 'smps_parents',
  staff: 'smps_staff',
  classes: 'smps_classes',
  sections: 'smps_sections',
  subjects: 'smps_subjects',
  attendance: 'smps_attendance',
  fees: 'smps_fees',
  admissions: 'smps_admissions',
  homework: 'smps_homework',
  exams: 'smps_exams',
  results: 'smps_results',
  leaves: 'smps_leaves',
  notices: 'smps_notices',
  messages: 'smps_messages',
  events: 'smps_events',
  transport: 'smps_transport',
  settings: 'smps_settings',
  activityLog: 'smps_activity',
  session: 'smps_session'
};

// ========== UTILITIES ==========
function generateId(prefix = 'ID') {
  return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 6).toUpperCase();
}

function getData(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function setData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getSettings() {
  const defaults = {
    schoolName: SCHOOL.name,
    schoolPhone: SCHOOL.phone,
    schoolWhatsapp: SCHOOL.whatsapp,
    schoolEmail: SCHOOL.email,
    schoolAddress: SCHOOL.address,
    logo: SCHOOL.logo
  };
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.settings);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch (e) {
    return defaults;
  }
}

function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

function formatDate(d) {
  if (!d) return '-';
  const date = new Date(d);
  return date.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatCurrency(n) {
  return 'Rs. ' + Number(n || 0).toLocaleString('en-PK');
}

function today() {
  return new Date().toISOString().split('T')[0];
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer') || createToastContainer();
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${icons[type] || icons.success}"></i><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function createToastContainer() {
  const el = document.createElement('div');
  el.id = 'toastContainer';
  el.className = 'toast-container';
  document.body.appendChild(el);
  return el;
}

function openWhatsApp(number, message = '') {
  if (!number) {
    showToast('No WhatsApp number available', 'error');
    return;
  }
  let cleaned = String(number).replace(/\D/g, '');
  if (cleaned.startsWith('0')) cleaned = '92' + cleaned.substring(1);
  if (!cleaned.startsWith('92')) cleaned = '92' + cleaned;
  const url = `https://wa.me/${cleaned}${message ? '?text=' + encodeURIComponent(message) : ''}`;
  window.open(url, '_blank');
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied to clipboard');
  }).catch(() => showToast('Copy failed', 'error'));
}

function confirmModal(title, message, onConfirm) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay show';
  overlay.innerHTML = `
    <div class="modal modal-sm">
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
      </div>
      <div class="modal-body"><p>${message}</p></div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
        <button class="btn btn-danger" id="confirmYesBtn">Confirm</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  document.getElementById('confirmYesBtn').onclick = () => {
    overlay.remove();
    onConfirm();
  };
}

function logActivity(action, details = '') {
  const logs = getData(STORAGE_KEYS.activityLog);
  const session = getSession();
  logs.unshift({
    id: generateId('LOG'),
    action,
    details,
    user: session ? session.name : 'System',
    role: session ? session.role : 'system',
    timestamp: new Date().toISOString()
  });
  if (logs.length > 200) logs.length = 200;
  setData(STORAGE_KEYS.activityLog, logs);
}

// ========== SESSION ==========
function getSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.session);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function setSession(user) {
  localStorage.setItem(STORAGE_KEYS.session, JSON.stringify({
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    email: user.email || '',
    phone: user.phone || '',
    photo: user.photo || '',
    loginAt: new Date().toISOString()
  }));
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.session);
}

function requireAuth(allowedRoles = []) {
  const session = getSession();
  if (!session) {
    window.location.href = 'login.html';
    return null;
  }
  if (allowedRoles.length && !allowedRoles.includes(session.role)) {
    showToast('Access denied', 'error');
    window.location.href = 'dashboard.html';
    return null;
  }
  return session;
}

// ========== INITIALIZE DEFAULT DATA ==========
function initDefaultData() {
  if (localStorage.getItem('smps_initialized')) return;

  // Admin user
  const users = [{
    id: 'USR_ADMIN',
    username: 'admin',
    password: 'admin123',
    name: 'System Administrator',
    role: 'admin',
    email: 'admin@smartmodern.edu.pk',
    phone: '03304886710',
    whatsapp: '03304886710',
    status: 'active',
    createdAt: new Date().toISOString()
  }];

  // Sample classes
  const classes = [
    { id: 'CLS_01', name: 'Class 1', sections: ['A', 'B'], teacherId: null, studentCount: 0 },
    { id: 'CLS_02', name: 'Class 2', sections: ['A', 'B'], teacherId: null, studentCount: 0 },
    { id: 'CLS_03', name: 'Class 3', sections: ['A', 'B'], teacherId: null, studentCount: 0 },
    { id: 'CLS_04', name: 'Class 4', sections: ['A', 'B'], teacherId: null, studentCount: 0 },
    { id: 'CLS_05', name: 'Class 5', sections: ['A', 'B'], teacherId: null, studentCount: 0 },
    { id: 'CLS_06', name: 'Class 6', sections: ['A', 'B'], teacherId: null, studentCount: 0 },
    { id: 'CLS_07', name: 'Class 7', sections: ['A', 'B'], teacherId: null, studentCount: 0 },
    { id: 'CLS_08', name: 'Class 8', sections: ['A', 'B'], teacherId: null, studentCount: 0 },
    { id: 'CLS_09', name: 'Class 9', sections: ['A', 'B'], teacherId: null, studentCount: 0 },
    { id: 'CLS_10', name: 'Class 10', sections: ['A', 'B'], teacherId: null, studentCount: 0 }
  ];

  const subjects = [
    { id: 'SUB_01', name: 'English', code: 'ENG' },
    { id: 'SUB_02', name: 'Urdu', code: 'URD' },
    { id: 'SUB_03', name: 'Mathematics', code: 'MATH' },
    { id: 'SUB_04', name: 'Science', code: 'SCI' },
    { id: 'SUB_05', name: 'Islamiat', code: 'ISL' },
    { id: 'SUB_06', name: 'Social Studies', code: 'SST' },
    { id: 'SUB_07', name: 'Computer', code: 'COMP' },
    { id: 'SUB_08', name: 'Physics', code: 'PHY' },
    { id: 'SUB_09', name: 'Chemistry', code: 'CHM' },
    { id: 'SUB_10', name: 'Biology', code: 'BIO' }
  ];

  // Sample teachers
  const teachers = [
    {
      id: 'TCH_001', teacherId: 'T-1001', name: 'Ali Raza', email: 'ali.raza@school.pk',
      phone: '03001234567', whatsapp: '03001234567', subject: 'Mathematics',
      classes: ['Class 8', 'Class 9'], qualification: 'M.Sc Mathematics',
      joiningDate: '2022-03-15', salary: 55000, status: 'active',
      address: 'Lahore', gender: 'Male', photo: ''
    },
    {
      id: 'TCH_002', teacherId: 'T-1002', name: 'Fatima Zahra', email: 'fatima@school.pk',
      phone: '03009876543', whatsapp: '03009876543', subject: 'English',
      classes: ['Class 6', 'Class 7'], qualification: 'M.A English',
      joiningDate: '2021-08-01', salary: 52000, status: 'active',
      address: 'Karachi', gender: 'Female', photo: ''
    },
    {
      id: 'TCH_003', teacherId: 'T-1003', name: 'Muhammad Hassan', email: 'hassan@school.pk',
      phone: '03111222333', whatsapp: '03111222333', subject: 'Science',
      classes: ['Class 5', 'Class 6'], qualification: 'B.Sc Science',
      joiningDate: '2023-01-10', salary: 48000, status: 'active',
      address: 'Islamabad', gender: 'Male', photo: ''
    }
  ];

  // Sample students
  const students = [
    {
      id: 'STU_001', admissionNo: 'ADM-2024-001', name: 'Ahmed Khan', fatherName: 'Imran Khan',
      className: 'Class 8', section: 'A', rollNo: '08', gender: 'Male',
      dob: '2012-05-15', phone: '03001112222', whatsapp: '03001112222',
      altPhone: '03003334444', email: '', address: 'House 12, Street 5, Lahore',
      admissionDate: '2024-04-01', previousSchool: '', status: 'active',
      bloodGroup: 'B+', photo: '', guardianName: 'Imran Khan', emergencyContact: '03003334444'
    },
    {
      id: 'STU_002', admissionNo: 'ADM-2024-002', name: 'Sara Ahmed', fatherName: 'Ahmed Ali',
      className: 'Class 7', section: 'B', rollNo: '12', gender: 'Female',
      dob: '2013-08-22', phone: '03005556666', whatsapp: '03005556666',
      altPhone: '', email: '', address: 'Flat 3, Block C, Karachi',
      admissionDate: '2024-04-01', previousSchool: '', status: 'active',
      bloodGroup: 'A+', photo: '', guardianName: 'Ahmed Ali', emergencyContact: '03005556666'
    },
    {
      id: 'STU_003', admissionNo: 'ADM-2024-003', name: 'Bilal Hussain', fatherName: 'Tariq Hussain',
      className: 'Class 9', section: 'A', rollNo: '05', gender: 'Male',
      dob: '2011-11-03', phone: '03217778888', whatsapp: '03217778888',
      altPhone: '03219990000', email: '', address: 'Village Road, Faisalabad',
      admissionDate: '2023-04-01', previousSchool: 'City Public School', status: 'active',
      bloodGroup: 'O+', photo: '', guardianName: 'Tariq Hussain', emergencyContact: '03219990000'
    },
    {
      id: 'STU_004', admissionNo: 'ADM-2024-004', name: 'Ayesha Malik', fatherName: 'Usman Malik',
      className: 'Class 5', section: 'A', rollNo: '03', gender: 'Female',
      dob: '2015-02-18', phone: '03331112222', whatsapp: '03331112222',
      altPhone: '', email: '', address: 'Gulberg, Lahore',
      admissionDate: '2024-04-01', previousSchool: '', status: 'active',
      bloodGroup: 'AB+', photo: '', guardianName: 'Usman Malik', emergencyContact: '03331112222'
    },
    {
      id: 'STU_005', admissionNo: 'ADM-2024-005', name: 'Hamza Sheikh', fatherName: 'Farooq Sheikh',
      className: 'Class 10', section: 'B', rollNo: '01', gender: 'Male',
      dob: '2010-07-30', phone: '03445556666', whatsapp: '03445556666',
      altPhone: '03447778888', email: '', address: 'Model Town, Lahore',
      admissionDate: '2022-04-01', previousSchool: '', status: 'active',
      bloodGroup: 'B+', photo: '', guardianName: 'Farooq Sheikh', emergencyContact: '03447778888'
    }
  ];

  // Sample parents linked
  const parents = [
    {
      id: 'PAR_001', name: 'Imran Khan', relation: 'Father', phone: '03001112222',
      whatsapp: '03001112222', email: 'imran@email.com', address: 'House 12, Street 5, Lahore',
      studentIds: ['STU_001'], status: 'active'
    },
    {
      id: 'PAR_002', name: 'Ahmed Ali', relation: 'Father', phone: '03005556666',
      whatsapp: '03005556666', email: '', address: 'Flat 3, Block C, Karachi',
      studentIds: ['STU_002'], status: 'active'
    }
  ];

  // Sample staff
  const staff = [
    {
      id: 'STF_001', staffId: 'S-2001', name: 'Kamran Iqbal', category: 'Accountant',
      phone: '03009998888', whatsapp: '03009998888', email: 'accounts@school.pk',
      joiningDate: '2020-06-01', salary: 40000, status: 'active', address: 'Lahore'
    },
    {
      id: 'STF_002', staffId: 'S-2002', name: 'Nadia Bibi', category: 'Receptionist',
      phone: '03008887777', whatsapp: '03008887777', email: '',
      joiningDate: '2021-02-15', salary: 28000, status: 'active', address: 'Lahore'
    }
  ];

  // Sample fees
  const fees = [
    {
      id: 'FEE_001', studentId: 'STU_001', studentName: 'Ahmed Khan', admissionNo: 'ADM-2024-001',
      className: 'Class 8', feeType: 'Monthly Fee', amount: 5000, paid: 5000, discount: 0,
      month: '2026-09', status: 'paid', paymentDate: '2026-09-05', receiptNo: 'RCPT-001', method: 'Cash'
    },
    {
      id: 'FEE_002', studentId: 'STU_002', studentName: 'Sara Ahmed', admissionNo: 'ADM-2024-002',
      className: 'Class 7', feeType: 'Monthly Fee', amount: 4500, paid: 0, discount: 0,
      month: '2026-09', status: 'pending', paymentDate: null, receiptNo: null, method: null
    },
    {
      id: 'FEE_003', studentId: 'STU_003', studentName: 'Bilal Hussain', admissionNo: 'ADM-2024-003',
      className: 'Class 9', feeType: 'Monthly Fee', amount: 5500, paid: 5500, discount: 0,
      month: '2026-09', status: 'paid', paymentDate: '2026-09-03', receiptNo: 'RCPT-002', method: 'Bank Transfer'
    }
  ];

  // Sample notices
  const notices = [
    {
      id: 'NTC_001', title: 'Welcome to New Academic Session 2026-27',
      content: 'School reopens on 1st April. All students must report in proper uniform.',
      audience: 'All', date: '2026-09-01', published: true, createdBy: 'admin'
    },
    {
      id: 'NTC_002', title: 'Parent-Teacher Meeting',
      content: 'PTM scheduled for 25th September. Parents are requested to attend.',
      audience: 'Parents', date: '2026-09-10', published: true, createdBy: 'admin'
    }
  ];

  setData(STORAGE_KEYS.users, users);
  setData(STORAGE_KEYS.classes, classes);
  setData(STORAGE_KEYS.subjects, subjects);
  setData(STORAGE_KEYS.teachers, teachers);
  setData(STORAGE_KEYS.students, students);
  setData(STORAGE_KEYS.parents, parents);
  setData(STORAGE_KEYS.staff, staff);
  setData(STORAGE_KEYS.fees, fees);
  setData(STORAGE_KEYS.notices, notices);
  setData(STORAGE_KEYS.attendance, []);
  setData(STORAGE_KEYS.admissions, []);
  setData(STORAGE_KEYS.homework, []);
  setData(STORAGE_KEYS.exams, []);
  setData(STORAGE_KEYS.results, []);
  setData(STORAGE_KEYS.leaves, []);
  setData(STORAGE_KEYS.messages, []);
  setData(STORAGE_KEYS.events, []);
  setData(STORAGE_KEYS.transport, []);
  setData(STORAGE_KEYS.activityLog, []);
  saveSettings(getSettings());

  localStorage.setItem('smps_initialized', '1');
}

// ========== STATS HELPERS ==========
function getDashboardStats() {
  const students = getData(STORAGE_KEYS.students).filter(s => s.status === 'active');
  const teachers = getData(STORAGE_KEYS.teachers).filter(t => t.status === 'active');
  const parents = getData(STORAGE_KEYS.parents).filter(p => p.status === 'active');
  const staff = getData(STORAGE_KEYS.staff).filter(s => s.status === 'active');
  const classes = getData(STORAGE_KEYS.classes);
  const fees = getData(STORAGE_KEYS.fees);
  const leaves = getData(STORAGE_KEYS.leaves);
  const admissions = getData(STORAGE_KEYS.admissions);
  const attendance = getData(STORAGE_KEYS.attendance);

  const todayStr = today();
  const currentMonth = todayStr.substring(0, 7);

  const monthlyCollected = fees
    .filter(f => f.status === 'paid' && f.month === currentMonth)
    .reduce((sum, f) => sum + (Number(f.paid) || 0), 0);

  const pendingFees = fees
    .filter(f => f.status === 'pending')
    .reduce((sum, f) => sum + (Number(f.amount) - Number(f.paid || 0)), 0);

  const todayAttendance = attendance.filter(a => a.date === todayStr && a.type === 'student');
  let presentCount = 0;
  if (todayAttendance.length) {
    presentCount = todayAttendance.reduce((s, a) => s + (a.records?.filter(r => r.status === 'present').length || 0), 0);
  }

  return {
    totalStudents: students.length,
    totalTeachers: teachers.length,
    totalParents: parents.length,
    totalStaff: staff.length,
    totalClasses: classes.length,
    todayAttendance: presentCount,
    monthlyFeeCollection: monthlyCollected,
    pendingFees,
    newAdmissions: admissions.filter(a => a.status === 'pending').length,
    pendingLeaves: leaves.filter(l => l.status === 'pending').length
  };
}

function getClassWiseStudents() {
  const students = getData(STORAGE_KEYS.students).filter(s => s.status === 'active');
  const map = {};
  students.forEach(s => {
    const c = s.className || 'Unknown';
    map[c] = (map[c] || 0) + 1;
  });
  return map;
}

function getGenderDistribution() {
  const students = getData(STORAGE_KEYS.students).filter(s => s.status === 'active');
  let male = 0, female = 0;
  students.forEach(s => {
    if ((s.gender || '').toLowerCase() === 'male') male++;
    else if ((s.gender || '').toLowerCase() === 'female') female++;
  });
  return { male, female };
}

function getFeeStatusCounts() {
  const fees = getData(STORAGE_KEYS.fees);
  return {
    paid: fees.filter(f => f.status === 'paid').length,
    pending: fees.filter(f => f.status === 'pending').length,
    partial: fees.filter(f => f.status === 'partial').length
  };
}

// Run init
initDefaultData();
