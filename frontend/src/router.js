import { ROUTES } from './config.js';
import { AuthController } from './controllers/AuthController.js';
import { DashboardController } from './controllers/DashboardController.js';
import { Layout } from './layout/Layout.js';
function isDashboardRoute(hash) { return hash.startsWith(ROUTES.DASHBOARD); }
export const Router = {
  navigate() {
    const root = document.getElementById('app');
    const hash = location.hash || ROUTES.LOGIN;
    Layout.draw();
    if (hash === ROUTES.LOGIN) {
      AuthController.renderLogin(root);
    } else if (isDashboardRoute(hash)) {
      DashboardController.render(root);
    } else {
      location.hash = ROUTES.LOGIN; return;
    }
    Layout.highlightActive();
  },
  init() { window.addEventListener('hashchange', () => this.navigate()); this.navigate(); },
};
