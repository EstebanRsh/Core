import { $ } from './utils/dom.js';
import { ROUTES, APP_NAME, STORAGE_KEYS } from './config.js';
import { AuthController } from './controllers/AuthController.js';
import { DashboardController } from './controllers/DashboardController.js';
function setHeader() {
  const header = $('#app-header');
  const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null');
  header.innerHTML = `
    <div class="nav">
      <strong>${APP_NAME}</strong>
      <span class="tag">${location.hash || ROUTES.LOGIN}</span>
      <span style="flex:1"></span>
      ${user ? `<span>${user.email ?? user.documento}</span>` : ''}
      ${user ? `<button id="btn-logout" class="btn">Salir</button>` : ''}
    </div>
  `;
  const btn = document.getElementById('btn-logout');
  if (btn) {
    btn.addEventListener('click', () => {
      localStorage.clear();
      location.hash = ROUTES.LOGIN;
    });
  }
}
export const Router = {
  routes: {
    [ROUTES.LOGIN]: (root) => AuthController.renderLogin(root),
    [ROUTES.DASHBOARD]: (root) => DashboardController.render(root),
  },
  navigate() {
    const root = document.getElementById('app');
    const hash = location.hash || ROUTES.LOGIN;
    setHeader();
    const handler = this.routes[hash];
    if (handler) {
      handler(root);
    } else {
      location.hash = ROUTES.LOGIN;
    }
  },
  init() {
    window.addEventListener('hashchange', () => this.navigate());
    this.navigate();
  },
};
