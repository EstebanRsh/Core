// src/views/LoginView.js
import { html } from "../utils/dom.js";

export function LoginView() {
  return html`
    <div class="auth-wrap">
      <div class="auth-grid">
        <section class="auth-hero">
          <h1>UP-Link: soluciones digitales modernas y accesibles</h1>
          <p class="lead">
            Somos un proveedor de internet que acerca conectividad confiable a
            <b>zonas urbanas y rurales</b>. Operamos en ------ y -----,
            ampliando nuestra cobertura para que más personas y negocios tengan
            acceso a servicios estables, seguros y a un precio justo.
          </p>
          <ul>
            <li>Enfoque en calidad de servicio y soporte local.</li>
            <li>Panel unificado para gestionar clientes, pagos y planes.</li>
            <li>Seguridad, rendimiento y crecimiento sostenido.</li>
          </ul>
        </section>

        <section class="auth-card" aria-labelledby="ttl-login">
          <h2 id="ttl-login" class="auth-title">Iniciar sesión</h2>
          <p class="auth-sub">Ingresá tu usuario y contraseña</p>

          <form id="form-login" novalidate>
            <!-- Usuario con botón de modo a la derecha -->
            <div class="field">
              <label for="usuario"><span id="id-label">Documento</span></label>
              <div class="input-wrap has-right-addon">
                <i
                  id="id-icon"
                  data-lucide="user"
                  data-lucide-size="18"
                  data-lucide-stroke="2"
                ></i>
                <input
                  id="usuario"
                  name="usuario"
                  type="text"
                  inputmode="numeric"
                  maxlength="11"
                  placeholder="20000000"
                  autocomplete="username"
                />
                <button
                  id="id-switch"
                  class="input-addon"
                  type="button"
                  data-mode="documento"
                  aria-label="Cambiar a Email"
                >
                  DNI
                </button>
              </div>
            </div>

            <!-- Password -->
            <div class="field">
              <label for="pwd">Password</label>
              <div class="input-wrap pwd-wrap has-right-addon">
                <i
                  data-lucide="lock"
                  data-lucide-size="18"
                  data-lucide-stroke="2"
                ></i>
                <input
                  id="pwd"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  autocomplete="current-password"
                  required
                />
                <button
                  id="btn-toggle-pwd"
                  type="button"
                  aria-label="Mostrar/ocultar"
                  class="input-addon"
                >
                  <i
                    data-lucide="eye"
                    data-lucide-size="18"
                    data-lucide-stroke="2"
                  ></i>
                </button>
              </div>
            </div>

            <div class="row-actions">
              <label><input id="remember" type="checkbox" /> Recordarme</label>
              <a href="#/login/forgot">¿Olvidaste tu contraseña?</a>
            </div>

            <div style="margin-top:10px">
              <button id="btn-login" class="btn-grad" type="submit">
                Ingresar
              </button>
            </div>

            <p id="login-error" role="alert" style="display:none"></p>
            <p class="auth-note">
              Ante cualquier inconveniente, contactá al administrador.
            </p>
          </form>
        </section>
      </div>
    </div>
  `;
}
