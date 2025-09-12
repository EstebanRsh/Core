const KEY_PREFIX = "UPCORE_";

function normalizeBaseUrl(url) {
  try {
    const u = new URL(url);
    const cleanPath = (u.pathname || "").replace(/\/+$/, "");
    return u.origin + cleanPath; // sin barra final
  } catch {
    return "http://localhost:8000";
  }
}

function resolveBaseUrl() {
  const meta = document.querySelector('meta[name="core-base-url"]')?.content;
  const win = window.__UPCORE_BASE_URL;
  const ls = localStorage.getItem(`${KEY_PREFIX}BASE_URL`);
  const raw = meta || win || ls || "http://localhost:8000";
  return normalizeBaseUrl(raw);
}

export const BASE_URL = resolveBaseUrl();

export const STORAGE_KEYS = Object.freeze({
  TOKEN: `${KEY_PREFIX}TOKEN`,
  USER: `${KEY_PREFIX}USER`,
  PROFILE: `${KEY_PREFIX}PROFILE`,
});

export const ROUTES = Object.freeze({
  LOGIN: "#/login",
  DASHBOARD: "#/dashboard",
});

export const APP_NAME = "UP-Core";
