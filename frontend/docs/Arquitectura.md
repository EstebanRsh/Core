Arquitectura basica MVC

/frontend/
├─ index.html # ÚNICA página HTML; todo es SPA con hash routing (#/login, #/dashboard, etc.)
├─ assets/
│ ├─ css/
│ │ └─ main.css # Estilos básicos
│ └─ img/ # Logos e íconos
└─ src/
├─ config.js # Config global (BASE_URL del backend, nombre de storage, etc.)
├─ router.js # Router por hash (controla navegación del SPA)
├─ app.js # “bootstrap” de la app: inicia Router, controla sesión
├─ utils/
│ ├─ dom.js # Helpers para manipular DOM sin frameworks
│ └─ http.js # Capa HTTP (fetch) + inyección de Authorization
├─ models/ # M (Model): lógica de datos / llamadas al backend
│ ├─ AuthModel.js # login/logout, perfil (/users/login, /me)
│ ├─ PagoModel.js # búsquedas, altas, PDF, etc. (/pagos/_)
│ └─ ClienteModel.js # CRUD y listados de clientes (/clientes/_)
├─ views/ # V (View): plantillas HTML “solo UI”
│ ├─ LoginView.js # formulario de login
│ └─ dashboards/
│ ├─ GerenteView.js # tablero gerente (placeholder)
│ ├─ OperadorView.js # tablero operador (placeholder)
│ └─ ClienteView.js # tablero cliente (placeholder)
└─ controllers/ # C (Controller): une Vista + Modelo + Router
├─ AuthController.js # maneja el submit del login, guarda token, redirige
└─ DashboardController.js # elige y pinta el dashboard según rol
