// src/router.js
import { ROUTES } from "./config.js";
import { AuthController } from "./controllers/AuthController.js";
import { DashboardController } from "./controllers/DashboardController.js";
import { Layout } from "./layout/Layout.js";

// 1) Helper: ¿estoy en login? (soporta subrutas como #/login/forgot)
function isAuthRoute(hash) {
  return hash === ROUTES.LOGIN || hash.startsWith("#/login");
}

// 2) Helper: ¿estoy en el dashboard?
function isDashboardRoute(hash) {
  return hash.startsWith(ROUTES.DASHBOARD);
}

export const Router = {
  async navigate() {
    const root = document.getElementById("app");
    const hash = location.hash || ROUTES.LOGIN;

    // 3) Toggle de la clase .auth en <html>
    //    - Si estoy en login => <html class="auth"> (CSS oculta sidebar y remaqueta)
    //    - Si salgo del login => se remueve .auth (sidebar vuelve a mostrarse)
    const isAuth = isAuthRoute(hash);
    document.documentElement.classList.toggle("auth", isAuth);

    // 4) Siempre pintamos el "marco" (header + sidebar)
    //    Nota: cuando .auth está activo, el CSS oculta el <aside>.
    Layout.draw();

    // 5) Montamos la vista correspondiente
    if (isAuth) {
      await AuthController.renderLogin(root);
    } else if (isDashboardRoute(hash)) {
      DashboardController.render(root);
    } else {
      // Fallback: si la ruta no existe, vamos a login
      location.hash = ROUTES.LOGIN;
      return;
    }

    // 6) Marca activo en el sidebar (si existe) y rehidrata iconos
    Layout.highlightActive();
  },

  // 7) Arranque del router + escucha de cambios de hash
  init() {
    window.addEventListener("hashchange", () => this.navigate());
    this.navigate();
  },
};
