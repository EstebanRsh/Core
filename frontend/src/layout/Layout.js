// src/layout/Layout.js
// Pinta el encabezado (navbar) y la barra lateral (sidebar) en #app-header / #app-sidebar.
// Integra íconos Lucide y el HoverMenu para submenús por hover.

import { $, html } from "../utils/dom.js";
import { APP_NAME, ROUTES, STORAGE_KEYS } from "../config.js";
import {
  createIcons,
  icons,
} from "https://cdn.jsdelivr.net/npm/lucide@latest/+esm";
import { HoverMenu } from "../components/HoverMenu.js";

/* 1) Definición del menú por rol ------------------------------------- */
function menu(role) {
  const common = [
    { id: "home", href: ROUTES.DASHBOARD, icon: "home", label: "Inicio" },
  ];

  if (role === "gerente") {
    return [
      ...common,
      {
        id: "clientes",
        icon: "users",
        label: "Clientes",
        children: [
          { label: "Nuevo cliente", href: "#/dashboard/clientes/nuevo" },
          { label: "Lista de clientes", href: "#/dashboard/clientes" },
        ],
      },
      {
        id: "pagos",
        icon: "credit-card",
        label: "Pagos",
        children: [
          { label: "Nuevo pago", href: "#/dashboard/pagos/nuevo" },
          { label: "Lista de pagos", href: "#/dashboard/pagos" },
        ],
      },
      {
        id: "reportes",
        href: "#/dashboard/reportes",
        icon: "bar-chart-3",
        label: "Reportes",
      },
      {
        id: "ajustes",
        href: "#/dashboard/ajustes",
        icon: "settings",
        label: "Ajustes",
      },
    ];
  }

  if (role === "operador") {
    return [
      ...common,
      {
        id: "pagos",
        icon: "credit-card",
        label: "Pagos",
        children: [
          { label: "Nuevo pago", href: "#/dashboard/pagos/nuevo" },
          { label: "Lista de pagos", href: "#/dashboard/pagos" },
        ],
      },
      {
        id: "pendientes",
        href: "#/dashboard/pendientes",
        icon: "clock",
        label: "Pendientes",
      },
    ];
  }

  // cliente
  return [
    ...common,
    {
      id: "mis-pagos",
      href: "#/dashboard/mis-pagos",
      icon: "receipt",
      label: "Mis pagos",
    },
    {
      id: "mis-datos",
      href: "#/dashboard/mis-datos",
      icon: "user",
      label: "Mis datos",
    },
  ];
}

/* 2) Navbar (marca, badge de rol, tema y logout) --------------------- */
function renderNavbar(role, user) {
  return html`
    <a href="${ROUTES.DASHBOARD}" class="navbar-brand">${APP_NAME}</a>
    <span class="nav-spacer"></span>
    ${role ? `<span class="badge">Rol: ${role}</span>` : ""}
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
      ? html`
          <a
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
          </a>
        `
      : ""}
  `;
}

/* 3) Sidebar (items; si un item tiene children => data-menu) --------- */
function renderSidebar(role, currentHash) {
  const items = menu(role);
  const lis = items
    .map((i) => {
      const hasChildren = Array.isArray(i.children);
      const href = i.href || "#";
      const attrs = hasChildren
        ? `data-menu="${i.id}" aria-haspopup="true" aria-expanded="false"`
        : "";
      return html` <li>
        <a
          class="side-link ${href === currentHash ? "active" : ""}"
          href="${href}"
          ${attrs}
          title="${i.label}"
          data-label="${i.label}"
        >
          <i
            data-lucide="${i.icon}"
            data-lucide-size="22"
            data-lucide-stroke="2.25"
            aria-hidden="true"
          ></i>
          <span class="side-label">${i.label}</span>
        </a>
      </li>`;
    })
    .join("");
  return html`<ul class="side-menu">
    ${lis}
  </ul>`;
}

/* 4) API pública del Layout ------------------------------------------ */
export const Layout = {
  draw() {
    // a) Detectar usuario/rol desde storage (p. ej., seteado por AuthModel.me())
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || "null");
    const profile = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.PROFILE) || "null"
    );
    const role = profile?.role || user?.role || "";

    // b) Pintar header + sidebar
    $("#app-header").innerHTML = renderNavbar(role, user);
    $("#app-sidebar").innerHTML = renderSidebar(role, location.hash);

    // c) Hidratar íconos
    createIcons({ icons });

    // d) Tema oscuro/claro (usamos data-theme en <html> y tokens CSS)
    $("#lnk-theme")?.addEventListener("click", (e) => {
      e.preventDefault();
      const curr =
        document.documentElement.getAttribute("data-theme") || "dark";
      const next = curr === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("THEME", next);
      // Cambiar icono moon/sun
      const i = document.querySelector("#lnk-theme i");
      if (i) {
        i.setAttribute("data-lucide", next === "dark" ? "moon" : "sun");
        createIcons({ icons });
      }
    });

    // e) Logout: limpia storage y navega a login
    $("#lnk-logout")?.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      location.hash = ROUTES.LOGIN;
    });

    // f) Submenús por hover: vinculamos HoverMenu a <a[data-menu]>
    const aside = $("#app-sidebar");
    aside?.querySelectorAll("a.side-link[data-menu]").forEach((a) => {
      const id = a.getAttribute("data-menu");
      const text = a.getAttribute("data-label") || "";
      HoverMenu.bind(a, {
        title: text,
        getItems: () => menu(role).find((it) => it.id === id)?.children || [],
      });
    });
  },

  // Marca el item activo según location.hash (útil en navegación)
  highlightActive() {
    const current = location.hash;
    document.querySelectorAll(".side-link").forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === current);
    });
    createIcons({ icons }); // por si cambió el icono de tema
  },
};
