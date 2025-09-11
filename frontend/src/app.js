import { Router } from './router.js';

// (A) Sidebar colapsado por defecto
document.documentElement.classList.add('sidebar-collapsed');

// (B) Aplica el tema guardado o 'dark' si no hay nada
const savedTheme = localStorage.getItem('THEME') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

// (C) Inicia el router
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Router.init());
} else {
  Router.init();
}
