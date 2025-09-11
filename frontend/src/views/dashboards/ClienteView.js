import { html } from '../../utils/dom.js';
export function ClienteView({ user, profile, section }) {
  return html`
    <section class="card">
      <h2>Mi Panel</h2>
      <p>Hola, <strong>${user?.email ?? user?.documento ?? 'cliente'}</strong>.</p>
      ${section ? `<p>Sección actual: <strong>${section}</strong></p>` : ''}
      <p>Tu <code>cliente_id</code> es: <strong>${profile?.cliente_id ?? 'N/D'}</strong></p>
      <div class="card">
        <h3>Mis pagos</h3>
        <p>Podrás descargar tus recibos PDF y ver el estado.</p>
      </div>
    </section>
  `;
}
