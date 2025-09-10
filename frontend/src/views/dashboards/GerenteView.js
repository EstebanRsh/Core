import { html } from '../../utils/dom.js';
export function GerenteView({ user, profile }) {
  return html`
    <section class="card">
      <h2>Dashboard Gerente</h2>
      <p>Bienvenido/a, <strong>${user?.email ?? user?.documento ?? 'usuario'}</strong>.</p>
      <div class="row cols-2">
        <div class="card">
          <h3>Pagos</h3>
          <p>Listado, filtros, confirmación y recibos PDF.</p>
        </div>
        <div class="card">
          <h3>Clientes</h3>
          <p>Altas, edición, búsqueda paginada.</p>
        </div>
      </div>
    </section>
  `;
}
