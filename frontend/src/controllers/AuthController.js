import { $, on, mount } from '../utils/dom.js';
import { AuthModel } from '../models/AuthModel.js';
import { LoginView } from '../views/LoginView.js';
import { ROUTES } from '../config.js';
export const AuthController = {
  renderLogin(root) {
    mount(root, LoginView());
    const form = $('#form-login', root);
    const $error = $('#login-error', root);
    on(form, 'submit', async (e) => {
      e.preventDefault();
      $error.style.display = 'none';
      const fd = new FormData(form);
      const email = (fd.get('email') || '').trim();
      const documento = (fd.get('documento') || '').toString().replace(/\D+/g,'');
      const password = (fd.get('password') || '').trim();
      if (!password || (!email && !documento)) { $error.textContent = 'Completá contraseña y (email o documento).'; $error.style.display = ''; return; }
      try {
        await AuthModel.login({ email: email || undefined, documento: documento || undefined, password });
        await AuthModel.me();
        location.hash = ROUTES.DASHBOARD;
      } catch (err) {
        $error.textContent = err.message || 'Error de autenticación';
        $error.style.display = '';
      }
    });
  }
};
