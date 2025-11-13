const LOGIN_URL = 'https://dummyjson.com/auth/login';
const TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';
export async function loginUsuario(username, password) {
  const res = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error en login');
  const token = data.accessToken || data.token || '';
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, JSON.stringify({
    id: data.id || null,
    username: data.username || '',
    firstName: data.firstName || '',
    lastName: data.lastName || ''
  }));
  return data;
}
export function isAuthenticated() {
  return !!sessionStorage.getItem(TOKEN_KEY);
}
function getLoginPath() {
  // Detecta si estamos en la carpeta admin/ y ajusta la ruta
  const path = location.pathname;
  return path.includes('/admin/') ? '../login.html' : './login.html';
}
export function requireAuth() {
  if (!isAuthenticated()) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    location.href = `${getLoginPath()}?returnUrl=${returnUrl}`;
  }
}
export function logout() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  location.href = getLoginPath();
}
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('logoutBtn');
  if (btn) btn.addEventListener('click', (e) => { e.preventDefault(); logout(); });
});