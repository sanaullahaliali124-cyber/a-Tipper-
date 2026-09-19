/**
 * Authentication Module
 */

function login(username, password, role) {
  const users = getData(STORAGE_KEYS.users);
  let user = users.find(u =>
    (u.username === username || u.email === username || u.phone === username) &&
    u.password === password &&
    u.role === role &&
    u.status !== 'inactive'
  );

  // Also check teachers, students, parents, staff collections for login
  if (!user) {
    if (role === 'teacher') {
      const teachers = getData(STORAGE_KEYS.teachers);
      const t = teachers.find(t =>
        (t.email === username || t.phone === username || t.teacherId === username) &&
        (t.password || 'teacher123') === password &&
        t.status === 'active'
      );
      if (t) {
        user = {
          id: t.id,
          username: t.teacherId || t.email,
          name: t.name,
          role: 'teacher',
          email: t.email,
          phone: t.phone,
          photo: t.photo
        };
      }
    } else if (role === 'student') {
      const students = getData(STORAGE_KEYS.students);
      const s = students.find(s =>
        (s.admissionNo === username || s.phone === username) &&
        (s.password || 'student123') === password &&
        s.status === 'active'
      );
      if (s) {
        user = {
          id: s.id,
          username: s.admissionNo,
          name: s.name,
          role: 'student',
          phone: s.phone,
          photo: s.photo
        };
      }
    } else if (role === 'parent') {
      const parents = getData(STORAGE_KEYS.parents);
      const p = parents.find(p =>
        (p.phone === username || p.email === username) &&
        (p.password || 'parent123') === password &&
        p.status === 'active'
      );
      if (p) {
        user = {
          id: p.id,
          username: p.phone,
          name: p.name,
          role: 'parent',
          phone: p.phone,
          photo: p.photo
        };
      }
    } else if (role === 'staff') {
      const staff = getData(STORAGE_KEYS.staff);
      const st = staff.find(s =>
        (s.staffId === username || s.phone === username || s.email === username) &&
        (s.password || 'staff123') === password &&
        s.status === 'active'
      );
      if (st) {
        user = {
          id: st.id,
          username: st.staffId,
          name: st.name,
          role: 'staff',
          phone: st.phone,
          photo: st.photo
        };
      }
    }
  }

  if (user) {
    setSession(user);
    logActivity('Login', `${user.name} (${user.role}) logged in`);
    return { success: true, user };
  }
  return { success: false, message: 'Invalid credentials or role' };
}

function logout() {
  const session = getSession();
  if (session) logActivity('Logout', `${session.name} logged out`);
  clearSession();
  window.location.href = 'login.html';
}

function changePassword(userId, role, oldPass, newPass) {
  if (role === 'admin') {
    const users = getData(STORAGE_KEYS.users);
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return { success: false, message: 'User not found' };
    if (users[idx].password !== oldPass) return { success: false, message: 'Current password incorrect' };
    users[idx].password = newPass;
    setData(STORAGE_KEYS.users, users);
    logActivity('Password Change', 'Admin changed password');
    return { success: true };
  }
  return { success: false, message: 'Not supported for this role yet' };
}

// Default credentials helper for login page
const DEFAULT_CREDS = {
  admin: { user: 'admin', pass: 'admin123' },
  teacher: { user: 'T-1001', pass: 'teacher123' },
  student: { user: 'ADM-2024-001', pass: 'student123' },
  parent: { user: '03001112222', pass: 'parent123' },
  staff: { user: 'S-2001', pass: 'staff123' }
};
