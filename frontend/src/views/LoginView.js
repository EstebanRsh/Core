// src/views/LoginView.js
import { html } from '../utils/dom.js';

export function LoginView() {
  return html`
    <div class="auth-wrap">
      <div class="auth-grid">
        <!-- Columna izquierda: HERO -->
        <section class="auth-hero">
          <h1>UP-Link: soluciones digitales modernas y accesibles</h1>
          <p class="lead">
            Somos un proveedor de internet que acerca conectividad confiable a
            <b>zonas urbanas y rurales</b>. Operamos en ------ y -----, ampliando nuestra
            cobertura para que más personas y negocios tengan acceso a servicios
            estables, seguros y a un precio justo.
          </p>
          <ul>
            <li>Enfoque en calidad de servicio y soporte local.</li>
            <li>Panel unificado para gestionar clientes, pagos y planes.</li>
            <li>Seguridad, rendimiento y crecimiento sostenido.</li>
          </ul>
        </section>

        <!-- Columna derecha: PANEL DE LOGIN -->
        <section class="auth-card" aria-labelledby="ttl-login">
          <h2 id="ttl-login" class="auth-title">Iniciar sesión</h2>
          <p class="auth-sub">Documento y contraseña para continuar</p>

          <form id="form-login" novalidate>
            <div class="field">
              <label for="doc">Documento</label>
              <div class="input-wrap">
                <i data-lucide="user" data-lucide-size="18" data-lucide-stroke="2"></i>
                <input id="doc" type="text" name="documento" inputmode="numeric" maxlength="11" placeholder="20000000000" />
              </div>
            </div>

            <div class="field">
              <label for="pwd">Password</label>
              <div class="input-wrap pwd-wrap">
                <i data-lucide="lock" data-lucide-size="18" data-lucide-stroke="2"></i>
                <input id="pwd" type="password" name="password" placeholder="••••••••" autocomplete="current-password" required />
                <button id="btn-toggle-pwd" type="button" aria-label="Mostrar/ocultar">
                  <i data-lucide="eye" data-lucide-size="18" data-lucide-stroke="2"></i>
                </button>
              </div>
            </div>

            <div class="row-actions">
              <label><input id="remember" type="checkbox" /> Recordarme</label>
              <a href="#/login/forgot">¿Olvidaste tu contraseña?</a>
            </div>

            <div style="margin-top:10px">
              <button id="btn-login" class="btn-grad" type="submit">Ingresar</button>
            </div>

            <p id="login-error" role="alert" style="display:none"></p>
            <p class="auth-note">Ante cualquier inconveniente, contactá al administrador.</p>
          </form>
        </section>
      </div>
    </div>
  `;
}
