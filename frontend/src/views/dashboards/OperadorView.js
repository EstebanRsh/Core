import { html } from '../../utils/dom.js';
export function OperadorView({ user, profile }) {
  return html`
    <section class="card">
      <h2>Dashboard Operador</h2>
      <p>Bienvenido/a, <strong>${user?.email ?? user?.documento ?? 'usuario'}</strong>.</p>
      <div class="card">
        <h3>Pagos</h3>
        <p>Búsqueda y registro (efectivo/transferencia), confirmación, anulación.</p>
      </div>
    </section>
  `;
}
