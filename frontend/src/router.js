// src/router.js
import { ROUTES } from './config.js';
import { AuthController } from './controllers/AuthController.js';
import { DashboardController } from './controllers/DashboardController.js';
import { Layout } from './layout/Layout.js';

function isAuthRoute(hash) {
  // Soporta '#/login' y subrutas como '#/login/forgot'
  return hash === ROUTES.LOGIN || hash.startsWith('#/login');
}
function isDashboardRoute(hash) { return hash.startsWith(ROUTES.DASHBOARD); }

export const Router = {
  async navigate() {
    const root = document.getElementById('app');
    const hash = location.hash || ROUTES.LOGIN;

    // Marca modo auth para estilos del login
    const isAuth = isAuthRoute(hash);
    document.documentElement.classList.toggle('auth', isAuth);

    // Dibuja layout (header+sidebar). Sidebar se oculta por CSS en modo auth.
    Layout.draw();

    if (isAuth) {
      await AuthController.renderLogin(root);
    } else if (isDashboardRoute(hash)) {
      DashboardController.render(root);
    } else {
      location.hash = ROUTES.LOGIN; return;
    }

    Layout.highlightActive();
  },
  init() { window.addEventListener('hashchange', () => this.navigate()); this.navigate(); }
};
