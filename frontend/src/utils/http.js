import { BASE_URL, STORAGE_KEYS, ROUTES } from '../config.js';
function getToken() { return localStorage.getItem(STORAGE_KEYS.TOKEN); }
export async function apiFetch(path, { method = 'GET', headers = {}, body, isForm = false } = {}) {
  const token = getToken();
  const finalHeaders = new Headers(headers);
  if (!isForm) { finalHeaders.set('Content-Type', 'application/json'); }
  if (token) { finalHeaders.set('Authorization', `Bearer ${token}`); }
  const resp = await fetch(`${BASE_URL}${path}`, {
    method, headers: finalHeaders, body: isForm ? body : (body ? JSON.stringify(body) : undefined),
  });
  const ct = resp.headers.get('Content-Type') || '';
  const isJson = ct.includes('application/json');
  if (resp.status === 401) {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    location.hash = ROUTES.LOGIN;
    throw new Error('No autorizado (401)');
  }
  if (!resp.ok) {
    const msg = isJson ? (await resp.json()).message : await resp.text();
    throw new Error(msg || `Error HTTP ${resp.status}`);
  }
  return isJson ? resp.json() : resp;
}
