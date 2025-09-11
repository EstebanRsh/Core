// src/layout/Layout.js
// (1) Helpers de DOM
import { $, html } from "../utils/dom.js";
// (2) Constantes globales
import { APP_NAME, ROUTES, STORAGE_KEYS } from "../config.js";
// (3) Lucide ESM: importamos la función y el set de íconos
import {
  createIcons,
  icons,
} from "https://cdn.jsdelivr.net/npm/lucide@latest/+esm";

// (4) Genera el menú del sidebar según el rol
function menu(role) {
  const common = [{ href: ROUTES.DASHBOARD, icon: "home", label: "Inicio" }];
  if (role === "gerente") {
    return [
      ...common,
      { href: "#/dashboard/pagos", icon: "credit-card", label: "Pagos" },
      { href: "#/dashboard/clientes", icon: "users", label: "Clientes" },
      { href: "#/dashboard/reportes", icon: "bar-chart-3", label: "Reportes" },
      { href: "#/dashboard/ajustes", icon: "settings", label: "Ajustes" },
    ];
  }
  if (role === "operador") {
    return [
      ...common,
      { href: "#/dashboard/pagos", icon: "credit-card", label: "Pagos" },
      {
        href: "#/dashboard/cargar-pago",
        icon: "plus-circle",
        label: "Cargar pago",
      },
      { href: "#/dashboard/pendientes", icon: "clock", label: "Pendientes" },
    ];
  }
  return [
    ...common,
    { href: "#/dashboard/mis-pagos", icon: "receipt", label: "Mis pagos" },
    { href: "#/dashboard/mis-datos", icon: "user", label: "Mis datos" },
  ];
}

// (5) Dibuja el navbar superior. Todo es <a>, no <button>.
function navbar(role, user) {
  return html`
    <a
      id="lnk-toggle-sidebar"
      href="#toggle"
      class="icon-link"
      aria-label="Alternar sidebar"
      role="button"
      title="Menú"
    >
      <i data-lucide="menu" data-lucide-size="22" data-lucide-stroke="2.25"></i>
    </a>
    <a href="${ROUTES.DASHBOARD}" class="navbar-brand">${APP_NAME}</a>
    <span class="nav-spacer"></span>
    ${role ? `<span class="badge">Rol: ${role}</span>` : ""}
    <a
      id="lnk-settings"
      href="#/dashboard/ajustes"
      class="icon-link"
      aria-label="Ajustes"
      title="Ajustes"
    >
      <i
        data-lucide="settings"
        data-lucide-size="22"
        data-lucide-stroke="2.25"
      ></i>
    </a>
    <a
      id="lnk-theme"
      href="#theme"
      class="icon-link"
      aria-label="Tema"
      title="Cambiar tema"
      role="button"
    >
      <i data-lucide="moon" data-lucide-size="22" data-lucide-stroke="2.25"></i>
    </a>
    ${user
      ? html` <a
          id="lnk-logout"
          href="#logout"
          class="icon-link"
          aria-label="Salir"
          title="Salir"
          role="button"
        >
          <i
            data-lucide="log-out"
            data-lucide-size="22"
            data-lucide-stroke="2.25"
          ></i>
        </a>`
      : ""}
  `;
}

// (6) Dibuja el sidebar lateral (enlaces a secciones del dashboard)
function sidebar(role, current) {
  const items = menu(role);
  const links = items
    .map(
      (i) => html`
        <li>
          <a
            class="side-link ${i.href === current ? "active" : ""}"
            href="${i.href}"
            title="${i.label}"
          >
            <i
              data-lucide="${i.icon}"
              data-lucide-size="22"
              data-lucide-stroke="2.25"
              aria-hidden="true"
            ></i>
            <span class="side-label">${i.label}</span>
          </a>
        </li>
      `
    )
    .join("");
  return html`<ul class="side-menu">
    ${links}
  </ul>`;
}

// (7) API del layout para el router
export const Layout = {
  draw() {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || "null"); // sesión
    const profile = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.PROFILE) || "null"
    ); // perfil
    const role = profile?.role || user?.role || ""; // rol efectivo

    // Inyecta navbar y sidebar
    const header = $("#app-header");
    const aside = $("#app-sidebar");
    if (header) header.innerHTML = navbar(role, user);
    if (aside) aside.innerHTML = sidebar(role, location.hash);

    // Hidrata íconos Lucide (convierte <i data-lucide="..."> a SVG)
    createIcons({ icons });

    // Enlaces de acción (no navegación real) -> preventDefault()
    $("#lnk-toggle-sidebar")?.addEventListener("click", (e) => {
      e.preventDefault();
      document.documentElement.classList.toggle("sidebar-collapsed");
      document.documentElement.classList.toggle("sidebar-open");
    });
    $("#lnk-theme")?.addEventListener("click", (e) => {
      e.preventDefault(); // evita que cambie el hash
      // 1) Lee el tema actual (por defecto 'dark' si no hay atributo)
      const curr =
        document.documentElement.getAttribute("data-theme") || "dark";
      // 2) Alterna entre 'dark' y 'light'
      const next = curr === "dark" ? "light" : "dark";
      // 3) Escribe el atributo para que el CSS se aplique
      document.documentElement.setAttribute("data-theme", next);
      // 4) Persiste la preferencia
      localStorage.setItem("THEME", next);
      const icon = document.querySelector("#lnk-theme i");
      if (icon) {
        icon.setAttribute("data-lucide", next === "dark" ? "moon" : "sun");
        createIcons({ icons });
      }
    });

    $("#lnk-logout")?.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.clear();
      location.hash = ROUTES.LOGIN;
    });

    // Cierra el drawer móvil al elegir una opción
    aside?.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (a) document.documentElement.classList.remove("sidebar-open");
    });
  },

  // Marca activo el link que coincide con el hash actual
  highlightActive() {
    const current = location.hash;
    document.querySelectorAll(".side-link").forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === current);
    });
    // Rehidrata por si hubo cambios de DOM
    createIcons({ icons });
  },
};
