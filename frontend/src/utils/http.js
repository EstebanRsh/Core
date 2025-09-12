import { BASE_URL, STORAGE_KEYS, ROUTES } from "../config.js";

function ensureLeadingSlash(path) {
  return path && path.startsWith("/") ? path : `/${path || ""}`;
}

export async function apiFetch(path, options = {}) {
  const {
    method = "GET",
    headers = {},
    body,
    json = true, // serializa body a JSON si es objeto
    auth = true, // agrega Authorization: Bearer <token> si existe
    credentials, // 'include' si usás cookies httpOnly
    signal,
  } = options;

  const url = `${BASE_URL}${ensureLeadingSlash(path)}`;
  const h = new Headers(headers);

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;
  let payload = body;

  if (json && body != null && !isFormData && typeof body !== "string") {
    h.set("Content-Type", "application/json");
    payload = JSON.stringify(body);
  }

  if (auth) {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) h.set("Authorization", `Bearer ${token}`);
  }

  const resp = await fetch(url, {
    method,
    headers: h,
    body: payload,
    credentials,
    signal,
  });

  if (resp.status === 401) {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    if (location.hash !== ROUTES.LOGIN) location.hash = ROUTES.LOGIN;
    throw new Error("No autorizado");
  }

  const ct = resp.headers.get("content-type") || "";
  const isJson = ct.includes("application/json");

  if (!resp.ok) {
    let msg = `HTTP ${resp.status}`;
    try {
      msg = isJson ? (await resp.json())?.message ?? msg : await resp.text();
    } catch {}
    throw new Error(msg);
  }

  return isJson ? resp.json() : resp.text();
}
