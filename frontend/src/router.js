import { ROUTES } from "./config.js";
import { AuthController } from "./controllers/AuthController.js";
import { DashboardController } from "./controllers/DashboardController.js";
import { Layout } from "./layout/Layout.js";

// ¿ruta de autenticación? (soporta subrutas como #/login/forgot)
function isAuthRoute(hash) {
  return hash === ROUTES.LOGIN || hash.startsWith("#/login");
}

// ¿ruta de dashboard?
function isDashboardRoute(hash) {
  return hash.startsWith(ROUTES.DASHBOARD);
}

export const Router = {
  async navigate() {
    const root = document.getElementById("app");
    const hash = location.hash || ROUTES.LOGIN;

    // 1) Activar/desactivar modo auth (oculta sidebar vía CSS)
    const isAuth = isAuthRoute(hash);
    document.documentElement.classList.toggle("auth", isAuth);

    // 2) Pintar marco (header + sidebar). En modo .auth el aside queda oculto por CSS
    Layout.draw();

    // 3) Montar vista
    if (isAuth) {
      await AuthController.renderLogin(root);
    } else if (isDashboardRoute(hash)) {
      DashboardController.render(root);
    } else {
      location.hash = ROUTES.LOGIN;
      return;
    }

    // 4) Resaltar ítem activo (si hay sidebar visible) e hidratar iconos
    Layout.highlightActive();
  },

  init() {
    window.addEventListener("hashchange", () => this.navigate());
    this.navigate();
  },
};
