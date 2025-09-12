import { apiFetch } from "../utils/http.js";
import { STORAGE_KEYS } from "../config.js";
export const AuthModel = {
  async login({ email, documento, password }) {
    const payload = { password };
    if (email) payload.email = email;
    if (documento) payload.documento = documento;
    const data = await apiFetch("/users/login", {
      method: "POST",
      body: payload,
    });
    localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
    return data.user;
  },
  async me() {
    const profile = await apiFetch("/me", { method: "GET" });
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    return profile;
  },
  logout() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
  },
  getSession() {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || "null");
    const profile = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.PROFILE) || "null"
    );
    return { token, user, profile };
  },
};
