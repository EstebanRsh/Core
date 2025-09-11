// src/components/HoverMenu.js
// Menú flotante que aparece al "hover" sobre íconos del sidebar.
// Incluye hover-intent (delays), cierre por ESC/scroll/navegación y soporte touch (click).

import { html } from '../utils/dom.js';

const OPEN_DELAY  = 120; // ms: evita abrir por roce
const CLOSE_DELAY = 280; // ms: tiempo de gracia al salir

let overlay, panel, openTimer = null, closeTimer = null, currentAnchor = null;

// Crea estructura DOM una sola vez
function ensureDOM() {
  if (overlay) return overlay;
  overlay = document.createElement('div');
  overlay.className = 'hm-overlay';
  overlay.dataset.show = 'false';
  overlay.style.display = 'none';
  overlay.innerHTML = `<div class="hm-panel"></div>`;
  panel = overlay.firstElementChild;
  document.body.appendChild(overlay);

  // Cerrar al click afuera
  overlay.addEventListener('mousedown', (e) => {
    if (!panel.contains(e.target)) closeNow();
  });

  // Mantener abierto si el mouse entra al panel
  panel.addEventListener('mouseenter', cancelClose);
  panel.addEventListener('mouseleave', scheduleClose);

  // Cerrar por teclado/scroll/navegación
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNow(); });
  window.addEventListener('scroll', closeNow, { passive: true });
  window.addEventListener('hashchange', closeNow);

  return overlay;
}

function renderPanel({ title, items }) {
  panel.innerHTML = html`
    ${title ? `<div class="hm-title">${title.toUpperCase()}</div>` : ''}
    <div class="hm-list">
      ${items.map(it => `<a href="${it.href}">${it.label}</a>`).join('')}
    </div>
  `;
}

function positionPanelFor(anchorRect, gap = 12) {
  // Por defecto, a la derecha del icono
  let x = anchorRect.right + gap;
  let y = Math.max(8, anchorRect.top);

  // Evitar overflow de pantalla
  const { offsetWidth: w, offsetHeight: h } = panel;
  if (x + w > window.innerWidth - 8) x = anchorRect.left - gap - w; // si no entra a derecha, va a izquierda
  if (y + h > window.innerHeight - 8) y = Math.max(8, window.innerHeight - h - 8);

  panel.style.left = `${x}px`;
  panel.style.top  = `${y}px`;
}

function openFor(anchor, { title, getItems }) {
  ensureDOM();
  currentAnchor = anchor;
  renderPanel({ title, items: getItems() });

  // Mostrar para medir y posicionar
  overlay.style.display = 'block';
  overlay.dataset.show  = 'false';
  positionPanelFor(anchor.getBoundingClientRect());

  // Activa transición de entrada
  requestAnimationFrame(() => {
    overlay.dataset.show = 'true';
  });
}

function closeNow() {
  if (!overlay) return;
  overlay.dataset.show = 'false';
  currentAnchor?.setAttribute?.('aria-expanded', 'false');
  currentAnchor = null;
  setTimeout(() => { if (overlay.dataset.show === 'false') overlay.style.display = 'none'; }, 180);
}

function cancelOpen()  { clearTimeout(openTimer);  openTimer  = null; }
function cancelClose() { clearTimeout(closeTimer); closeTimer = null; }
function scheduleOpen(anchor, opts)  { cancelOpen();  openTimer  = setTimeout(() => openFor(anchor, opts), OPEN_DELAY); }
function scheduleClose()             { cancelClose(); closeTimer = setTimeout(closeNow, CLOSE_DELAY); }

export const HoverMenu = {
  /**
   * Vincula un <a> del sidebar con el HoverMenu.
   * - title: string mostrado arriba de las opciones
   * - getItems: () => [{label, href}]
   */
  bind(anchor, { title = '', getItems }) {
    ensureDOM();

    // Hover (mouse)
    anchor.addEventListener('mouseenter', () => {
      cancelClose();
      scheduleOpen(anchor, { title, getItems });
      anchor.setAttribute('aria-expanded', 'true');
    });
    anchor.addEventListener('mouseleave', () => {
      cancelOpen();
      scheduleClose();
    });

    // Touch/click: abrir explícitamente (y no navegar)
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      cancelClose();
      openFor(anchor, { title, getItems });
      anchor.setAttribute('aria-expanded', 'true');
    });
  }
};
