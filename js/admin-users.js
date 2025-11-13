const API_USERS = 'https://dummyjson.com/users?limit=100';

async function fetchUsers() {
  const res = await fetch(API_USERS);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.users || [];
}

function sanitize(user) {
  return {
    id: user.id,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    username: user.username || '',
    email: user.email || '',
    phone: user.phone || '',
    city: (user.address && user.address.city) ? user.address.city : ''
  };
}

function renderTable(users) {
  const tbody = document.querySelector('#usuariosTable tbody');
  tbody.innerHTML = '';
  users.forEach(u => {
    const tr = document.createElement('tr');
    const nombre = `${u.firstName} ${u.lastName}`.trim();
    tr.innerHTML = `
      <td>${u.id}</td>
      <td>${escapeHtml(nombre)}</td>
      <td>${escapeHtml(u.username)}</td>
      <td>${escapeHtml(u.email)}</td>
      <td>${escapeHtml(u.phone)}</td>
      <td>${escapeHtml(u.city)}</td>
    `;
    tbody.appendChild(tr);
  });
}

function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

async function loadAndRender() {
  const errEl = document.getElementById('adminUsersError');
  errEl.style.display = 'none';
  try {
    const rawUsers = await fetchUsers();
    const safe = rawUsers.map(sanitize);
    renderTable(safe);
  } catch (err) {
    console.error(err);
    errEl.textContent = 'No se pudieron cargar los usuarios. Reintente más tarde.';
    errEl.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadAndRender();
  document.getElementById('btnRefresh').addEventListener('click', loadAndRender);

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    // Detecta si estamos en admin/ y ajusta la ruta
    const loginPath = location.pathname.includes('/admin/') ? '../login.html' : './login.html';
    location.href = loginPath;
  });
});