// src/controllers/AuthController.js
// Controla el login y el botón de modo dentro del input (DNI/Email).

import { $, on, mount } from "../utils/dom.js";
import { AuthModel } from "../models/AuthModel.js";
import { LoginView } from "../views/LoginView.js";
import { ROUTES } from "../config.js";
import { isEmail, toDocumento } from "../utils/validation.js";
import {
  createIcons,
  icons,
} from "https://cdn.jsdelivr.net/npm/lucide@latest/+esm";

export const AuthController = {
  async renderLogin(root) {
    // Modo login (oculta sidebar por CSS)
    document.documentElement.classList.add("auth");

    // Monta vista e hidrata íconos
    mount(root, LoginView());
    createIcons({ icons });

    // Refs
    const form = $("#form-login", root);
    const $error = $("#login-error", root);
    const $btn = $("#btn-login", root);
    const $pwd = $("#pwd", root);
    const $togglePwd = $("#btn-toggle-pwd", root);

    const $idLabel = $("#id-label", root);
    const $idIcon = $("#id-icon", root);
    const $usuario = $("#usuario", root);
    const $idSwitch = $("#id-switch", root);
    const $remember = $("#remember", root);

    // Estado del modo: 'documento' | 'email' (inicial según data-mode del botón)
    let idMode = $idSwitch.getAttribute("data-mode") || "documento";

    // Aplica el modo visual y de validación al campo usuario
    function applyMode(next) {
      idMode = next;
      const isDoc = idMode === "documento";

      // Etiqueta + icono
      $idLabel.textContent = isDoc ? "Documento" : "Email";
      $idIcon.setAttribute("data-lucide", isDoc ? "user" : "mail");

      // Atributos del input
      if (isDoc) {
        $usuario.type = "text";
        $usuario.setAttribute("inputmode", "numeric");
        $usuario.setAttribute("maxlength", "11");
        $usuario.setAttribute("placeholder", "20000000");
        // Limpia caracteres no numéricos si venías de email
        $usuario.value = $usuario.value.replace(/\D+/g, "");
      } else {
        $usuario.type = "email";
        $usuario.removeAttribute("maxlength");
        $usuario.setAttribute("inputmode", "email");
        $usuario.setAttribute("placeholder", "tu@correo.com");
      }

      // Botón (texto/accesibilidad)
      $idSwitch.textContent = isDoc ? "DNI" : "Email";
      $idSwitch.setAttribute("data-mode", idMode);
      $idSwitch.setAttribute(
        "aria-label",
        isDoc ? "Cambiar a Email" : "Cambiar a DNI"
      );

      // Rehidratar iconos tras cambiar data-lucide
      createIcons({ icons });
    }

    // Toggle del botón de modo
    on($idSwitch, "click", () => {
      applyMode(idMode === "documento" ? "email" : "documento");
      // Heurística opcional: si escribe '@', cambiamos a email automáticamente
    });

    // Mostrar/ocultar password
    on($togglePwd, "click", () => {
      const isPwd = $pwd.type === "password";
      $pwd.type = isPwd ? "text" : "password";
      $togglePwd
        .querySelector("i")
        ?.setAttribute("data-lucide", isPwd ? "eye-off" : "eye");
      createIcons({ icons });
    });

    // Autorrelleno documento guardado
    const lastDoc = localStorage.getItem("last_doc");
    if (lastDoc) {
      applyMode("documento");
      $usuario.value = lastDoc;
      if ($remember) $remember.checked = true;
    } else {
      applyMode(idMode); // inicial
    }

    // Submit
    on(form, "submit", async (e) => {
      e.preventDefault();
      $error.style.display = "none";
      $btn.disabled = true;

      const usuario = ($usuario.value || "").trim();
      const password = ($pwd.value || "").trim();

      // Validación por modo
      let payload = null;

      if (idMode === "email") {
        if (!isEmail(usuario)) {
          $error.textContent =
            "Ingresá un email válido (ej: nombre@dominio.com).";
          $error.style.display = "";
          $btn.disabled = false;
          return;
        }
        payload = { email: usuario, password };
      } else {
        const doc = toDocumento(usuario);
        if (!doc) {
          $error.textContent =
            "El documento debe tener entre 7 y 11 dígitos (sin puntos).";
          $error.style.display = "";
          $btn.disabled = false;
          return;
        }
        payload = { documento: doc, password };
      }

      if (!password) {
        $error.textContent = "Ingresá tu contraseña.";
        $error.style.display = "";
        $btn.disabled = false;
        return;
      }

      try {
        // Recordarme sólo documento (opcional por privacidad)
        if ($remember?.checked && payload.documento)
          localStorage.setItem("last_doc", payload.documento);
        else if ($remember) localStorage.removeItem("last_doc");

        await AuthModel.login(payload);
        await AuthModel.me();
        location.hash = ROUTES.DASHBOARD;
      } catch (err) {
        $error.textContent = err?.message || "Error de autenticación";
        $error.style.display = "";
      } finally {
        $btn.disabled = false;
      }
    });
  },
};
