// src/controllers/AuthController.js
import { $, on, mount } from '../utils/dom.js';
import { AuthModel } from '../models/AuthModel.js';
import { LoginView } from '../views/LoginView.js';
import { ROUTES, STORAGE_KEYS } from '../config.js';
import { createIcons, icons } from 'https://cdn.jsdelivr.net/npm/lucide@latest/+esm';

export const AuthController = {
  async renderLogin(root) {
    // Aseguramos clase 'auth' (por si el router no la aplicó aún)
    document.documentElement.classList.add('auth');

    // Montamos la vista y luego hidratamos íconos
    mount(root, LoginView());
    createIcons({ icons });

    const form   = $('#form-login', root);
    const $error = $('#login-error', root);
    const $btn   = $('#btn-login', root);
    const $pwd   = $('#pwd', root);
    const $togglePwd = $('#btn-toggle-pwd', root);
    const $remember = $('#remember', root);

    // Toggle mostrar/ocultar contraseña
    on($togglePwd, 'click', () => {
      const isPwd = $pwd.type === 'password';
      $pwd.type = isPwd ? 'text' : 'password';
      $togglePwd.querySelector('i')?.setAttribute('data-lucide', isPwd ? 'eye-off' : 'eye');
      createIcons({ icons });
    });

    // Autorrelleno documento si está recordado
    const lastDoc = localStorage.getItem('last_doc');
    if (lastDoc) {
      const doc = $('#doc', root);
      doc.value = lastDoc;
      $remember.checked = true;
    }

    on(form, 'submit', async (e) => {
      e.preventDefault();
      $error.style.display = 'none';
      $btn.disabled = true;

      const fd = new FormData(form);
      const documento = (fd.get('documento') || '').toString().replace(/\D+/g,'');
      const password  = (fd.get('password') || '').toString().trim();

      if (!documento || !password) {
        $error.textContent = 'Completá documento y contraseña.';
        $error.style.display = '';
        $btn.disabled = false;
        return;
      }

      try {
        if ($remember.checked) localStorage.setItem('last_doc', documento);
        else localStorage.removeItem('last_doc');

        await AuthModel.login({ documento, password });
        await AuthModel.me();
        location.hash = ROUTES.DASHBOARD;
      } catch (err) {
        $error.textContent = err?.message || 'Error de autenticación';
        $error.style.display = '';
      } finally {
        $btn.disabled = false;
      }
    });
  }
};
