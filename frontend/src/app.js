import { Router } from "./router.js";
// (1) Sidebar colapsado por defecto (estilo icon-only)
document.documentElement.classList.add("sidebar-collapsed");
// (2) Arranque del router cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => Router.init());
} else {
  Router.init();
}
