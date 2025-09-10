import { html } from '../utils/dom.js';
export function LoginView() {
  return html`
    <section class="card" aria-labelledby="ttl-login">
      <h1 id="ttl-login">Iniciar sesión</h1>
      <p>Podés ingresar con <strong>email</strong> <em>o</em> con <strong>documento</strong>.</p>
      <form id="form-login" class="row">
        <div class="row cols-2">
          <label>
            <span>Email</span>
            <input type="email" name="email" placeholder="tu@correo.com" autocomplete="username" />
          </label>
          <label>
            <span>Documento</span>
            <input type="text" name="documento" maxlength="11" inputmode="numeric" placeholder="DNI sin puntos" />
          </label>
        </div>
        <label>
          <span>Contraseña</span>
          <input type="password" name="password" autocomplete="current-password" required />
        </label>
        <div class="row">
          <button class="btn" type="submit">Entrar</button>
        </div>
        <p id="login-error" role="alert" style="color:#b00020;display:none"></p>
      </form>
      <p class="tag">Tip: basta con completar <em>uno</em> entre Email o Documento.</p>
    </section>
  `;
}
