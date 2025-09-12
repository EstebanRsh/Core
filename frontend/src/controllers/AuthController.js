// src/controllers/AuthController.js
// Controller de autenticación: pinta la vista, engancha eventos y llama al modelo.

import { $, on, mount } from "../utils/dom.js";
import { AuthModel } from "../models/AuthModel.js";
import { LoginView } from "../views/LoginView.js";
import { ROUTES, STORAGE_KEYS } from "../config.js";
import {
  createIcons,
  icons,
} from "https://cdn.jsdelivr.net/npm/lucide@latest/+esm";

export const AuthController = {
  async renderLogin(root) {
    // 1) Modo login: asegura la clase .auth en <html> para que CSS oculte el sidebar.
    document.documentElement.classList.add("auth");

    // 2) Pinta la vista (markup) en #app y “hidrata” íconos Lucide.
    mount(root, LoginView());
    createIcons({ icons });

    // 3) Cache de nodos que vamos a usar.
    const form = $("#form-login", root);
    const errorBox = $("#login-error", root);
    const btnSubmit = $("#btn-login", root);
    const inputPwd = $("#pwd", root);
    const btnToggle = $("#btn-toggle-pwd", root);
    const inputDoc = $("#doc", root);
    const rememberCB = $("#remember", root);

    // 4) Recordar documento: si lo guardamos antes, lo auto-cargamos.
    const lastDoc = localStorage.getItem("last_doc");
    if (lastDoc && inputDoc) {
      inputDoc.value = lastDoc;
      if (rememberCB) rememberCB.checked = true;
    }

    // 5) Mostrar/ocultar contraseña (cambia icono eye/eye-off)
    on(btnToggle, "click", () => {
      const isPwd = inputPwd.type === "password";
      inputPwd.type = isPwd ? "text" : "password";
      btnToggle
        .querySelector("i")
        ?.setAttribute("data-lucide", isPwd ? "eye-off" : "eye");
      createIcons({ icons }); // rehidrata icono toggled
    });

    // 6) Submit del login: validación mínima + llamada al modelo.
    on(form, "submit", async (e) => {
      e.preventDefault();
      errorBox.style.display = "none";
      btnSubmit.disabled = true;

      // Sanitización: DNI solo dígitos; password trim.
      const fd = new FormData(form);
      const documento = String(fd.get("documento") || "").replace(/\D+/g, "");
      const password = String(fd.get("password") || "").trim();

      if (!documento || !password) {
        errorBox.textContent = "Completá documento y contraseña.";
        errorBox.style.display = "";
        btnSubmit.disabled = false;
        return;
      }

      try {
        // Persistimos "recordarme" en localStorage
        if (rememberCB?.checked) localStorage.setItem("last_doc", documento);
        else localStorage.removeItem("last_doc");

        // Llamada al backend (AuthModel encapsula la API)
        await AuthModel.login({ documento, password });
        await AuthModel.me(); // trae perfil/rol y lo guarda (tipicamente)
        location.hash = ROUTES.DASHBOARD; // navegamos al dashboard
      } catch (err) {
        errorBox.textContent = err?.message || "Error de autenticación";
        errorBox.style.display = "";
      } finally {
        btnSubmit.disabled = false;
      }
    });
  },
};
