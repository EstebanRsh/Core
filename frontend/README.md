# UP-Core Frontend (COMPLETO)

SPA HTML5 + JS puro con patrón MVC y hash routing.
Incluye Login funcional conectado al backend y placeholders de dashboards por rol.

## Cómo correr
1) Backend (FastAPI): `uvicorn app:api_upcore --reload` (ajusta módulo si aplica).
2) Frontend (servidor estático dentro de `frontend_completo/`):
   - VSCode Live Server, o
   - `python -m http.server 8001`
3) Abre `http://localhost:8001` y logueate con email o documento + contraseña.

### Configuración rápida
- `src/config.js` -> `BASE_URL` apunta por defecto a `http://localhost:8000`. Puedes cambiarlo o sobreescribirlo con LocalStorage (`UPCORE_BASE_URL`).

### Rutas
- `#/login` y `#/dashboard` (elige vista según `role`).
