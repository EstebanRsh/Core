// src/layout/Layout.js
// Layout general: navbar + sidebar con submenús por HoverMenu.

import { $, html } from '../utils/dom.js';
import { APP_NAME, ROUTES, STORAGE_KEYS } from '../config.js';
import { createIcons, icons } from 'https://cdn.jsdelivr.net/npm/lucide@latest/+esm';
import { HoverMenu } from '../components/HoverMenu.js';

/* ---------- Menú por rol ---------- */
function menu(role) {
  const common = [{ id:'home', href: ROUTES.DASHBOARD, icon:'home', label:'Inicio' }];

  if (role === 'gerente') {
    return [
      ...common,
      { id:'clientes', icon:'users', label:'Clientes', children: [
        { label:'Nuevo cliente',  href:'#/dashboard/clientes/nuevo' },
        { label:'Lista de clientes', href:'#/dashboard/clientes' },
      ]},
      { id:'pagos', icon:'credit-card', label:'Pagos', children: [
        { label:'Nuevo pago',  href:'#/dashboard/pagos/nuevo' },
        { label:'Lista de pagos', href:'#/dashboard/pagos' },
      ]},
      { id:'reportes', href:'#/dashboard/reportes', icon:'bar-chart-3', label:'Reportes' },
      { id:'ajustes',  href:'#/dashboard/ajustes',  icon:'settings',    label:'Ajustes' },
    ];
  }

  if (role === 'operador') {
    return [
      ...common,
      { id:'pagos', icon:'credit-card', label:'Pagos', children: [
        { label:'Nuevo pago',  href:'#/dashboard/pagos/nuevo' },
        { label:'Lista de pagos', href:'#/dashboard/pagos' },
      ]},
      { id:'pendientes', href:'#/dashboard/pendientes', icon:'clock', label:'Pendientes' },
    ];
  }

  // cliente
  return [
    ...common,
    { id:'mis-pagos', href:'#/dashboard/mis-pagos', icon:'receipt', label:'Mis pagos' },
    { id:'mis-datos', href:'#/dashboard/mis-datos', icon:'user',    label:'Mis datos' },
  ];
}

/* ---------- Navbar (sin hamburguesa) ---------- */
function navbar(role, user) {
  return html`
    <a href="${ROUTES.DASHBOARD}" class="navbar-brand">${APP_NAME}</a>
    <span class="nav-spacer"></span>
    ${role ? `<span class="badge">Rol: ${role}</span>` : ''}
    <a id="lnk-theme" href="#theme" class="icon-link" aria-label="Tema" title="Cambiar tema" role="button">
      <i data-lucide="moon" data-lucide-size="22" data-lucide-stroke="2.25"></i>
    </a>
    ${user ? html`
      <a id="lnk-logout" href="#logout" class="icon-link" aria-label="Salir" title="Salir" role="button">
        <i data-lucide="log-out" data-lucide-size="22" data-lucide-stroke="2.25"></i>
      </a>` : ''}
  `;
}

/* ---------- Sidebar (icon-only). Si hay children => data-menu ---------- */
function sidebar(role, current) {
  const items = menu(role);
  const links = items.map(i => {
    const hasChildren = Array.isArray(i.children);
    const href = i.href || '#';
    const attrs = hasChildren ? `data-menu="${i.id}" aria-haspopup="true" aria-expanded="false"` : '';
    return html`
      <li>
        <a class="side-link ${href===current ? 'active' : ''}" href="${href}" ${attrs} title="${i.label}" data-label="${i.label}">
          <i data-lucide="${i.icon}" data-lucide-size="22" data-lucide-stroke="2.25" aria-hidden="true"></i>
          <span class="side-label">${i.label}</span>
        </a>
      </li>
    `;
  }).join('');
  return html`<ul class="side-menu">${links}</ul>`;
}

/* ---------- API del layout ---------- */
export const Layout = {
  draw() {
    const user    = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)    || 'null');
    const profile = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILE) || 'null');
    const role = (profile?.role) || user?.role || '';

    // Pintar navbar + sidebar
    const header = $('#app-header');
    const aside  = $('#app-sidebar');
    if (header) header.innerHTML = navbar(role, user);
    if (aside)  aside.innerHTML  = sidebar(role, location.hash);

    // Íconos Lucide (usa el set completo para nítidez)
    createIcons({ icons });

    // Tema (solo body) + persistencia
    $('#lnk-theme')?.addEventListener('click', (e) => {
      e.preventDefault();
      const curr = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = curr === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('THEME', next);
      const icon = document.querySelector('#lnk-theme i');
      if (icon) { icon.setAttribute('data-lucide', next === 'dark' ? 'moon' : 'sun'); createIcons({ icons }); }
    });

    // Logout
    $('#lnk-logout')?.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.clear();
      location.hash = ROUTES.LOGIN;
    });

    // Vincular HoverMenu a ítems con submenú
    aside?.querySelectorAll('a.side-link[data-menu]').forEach(a => {
      const id = a.getAttribute('data-menu');
      HoverMenu.bind(a, {
        title: a.getAttribute('data-label') || '',
        getItems: () => (menu(role).find(it => it.id === id)?.children) || []
      });
    });
  },

  highlightActive() {
    const current = location.hash;
    document.querySelectorAll('.side-link').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === current);
    });
    createIcons({ icons });
  }
};
