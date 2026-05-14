# Importadora SAVS - The Destiny Vault 🚗💨

## 📝 Descripción General
**Importadora SAVS (The Destiny Vault)** es una plataforma web moderna y robusta diseñada para la gestión y visualización de un catálogo de vehículos de importación, específicamente desde Corea y otros mercados hacia Costa Rica. La aplicación ofrece una experiencia de usuario premium, permitiendo a los clientes explorar inventarios, calcular financiamientos, y gestionar sus perfiles, mientras proporciona a los administradores herramientas completas para la gestión del negocio.

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 19 & Vite**: Motor principal para una interfaz rápida y reactiva.
- **React Router Dom 7**: Gestión de navegación y rutas protegidas.
- **Lucide React**: Biblioteca de iconos vectoriales para una estética moderna.
- **Vanilla CSS**: Sistema de estilos personalizado basado en variables de CSS para temas y diseño responsivo.
- **SweetAlert2**: Notificaciones y alertas interactivas estéticas.
- **Recharts**: Visualización de datos estadísticos en el panel administrativo.
- **EmailJS**: Integración para el envío de correos electrónicos desde formularios de contacto.
- **Motion (Framer Motion)**: Biblioteca de animaciones avanzadas para transiciones, efectos como `ShimmerText` y micro-animaciones fluidas.

### Backend
- **Node.js + Express v5**: Servidor HTTP con API RESTful versionada (`/api/v1`).
- **Sequelize v6 (ORM)**: Gestión de modelos, migraciones y relaciones con MySQL.
- **MySQL 8**: Base de datos relacional de producción.
- **JWT + bcrypt**: Autenticación segura con tokens en cookies HttpOnly.
- **Groq Cloud (LLaMA 3.3 70B)**: Motor de IA para el chatbot inteligente.

### Testing
- **Jest**: Framework de pruebas unitarias y de integración.
- **Supertest**: Pruebas HTTP de integración contra la API.

---

## 📁 Estructura del Proyecto (Arquitectura Técnica)

> Consulta el archivo [ARCHITECTURE.md](./ARCHITECTURE.md) para un desglose detallado de la arquitectura de capas, diagramas de flujo de datos, esquema de base de datos y convenciones del proyecto.

```
The-destiny-vault/
├── backend/                 # Servidor Node.js/Express
│   ├── config/              # Configuración de Sequelize (config.json)
│   ├── controllers/         # Lógica de negocio por recurso
│   ├── middlewares/         # Autenticación JWT y autorización por rol
│   ├── migrations/          # Migraciones de base de datos Sequelize
│   ├── models/              # Modelos Sequelize (Auto, Usuario, Rol, etc.)
│   ├── routes/              # Definición de endpoints RESTful
│   ├── seeders/             # Datos iniciales para la base de datos
│   ├── tests/               # Pruebas de integración (Jest + Supertest)
│   └── server.js            # Punto de entrada del backend
├── src/                     # Frontend React
│   ├── api/                 # Instancia de Axios configurada
│   ├── components/          # Componentes reutilizables (15+ módulos)
│   ├── hooks/               # Custom hooks de React
│   ├── pages/               # Vistas principales por feature
│   ├── routes/              # Enrutamiento y protección de rutas
│   └── utils/               # Funciones utilitarias
├── ARCHITECTURE.md          # Documentación de arquitectura técnica
└── README.md                # Este archivo
```

### 1. `src/routes`: Distribución de Navegación
La lógica de rutas reside en `AppRoutes.jsx`. Utiliza componentes de protección como `AdminRoute.jsx` para restringir el acceso al panel administrativo basado en el rol del usuario (`admin` o `gerente`).

### 2. `src/pages`: Vistas Principales
Las páginas se han organizado de forma modular:
- **`homepage/`**: Contiene `Home.jsx` y `HomeLogica.jsx`. Gestiona la landing page, secciones de experiencia, marcas y destacados del catálogo.
- **`catalogpage/`**: Contiene `Catalog.jsx`. Implementa el inventario completo con filtros avanzados.
- **`VehicleDetails/`**: Vista detallada de cada auto, galería de imágenes y especificaciones técnicas.
- **`admin/`**: Versión completa del Dashboard administrativo, gestión de usuarios, solicitudes y creación de vehículos.

### 3. `src/components`: Componentes Modulares
El sistema se divide en más de 15 categorías de componentes, incluyendo:
- **`layout/` & `footer/`**: Estructura global.
- **`Navbar/`**: Barra de navegación inteligente con búsqueda global, animaciones y gestión de sesión.
- **`CreditSimulator/`**: Herramienta interactiva para cálculos financieros.
- **`admin/`**: Sidebar, layouts y tablas específicas para la gestión.
- **`CatalogoDeVehiculos/`**: Componentes reutilizables para mostrar tarjetas de vehículos y filtros.
- **`Chatbot/`**: Asistente virtual flotante para soporte automatizado integrado con WhatsApp.

### 4. `src/hooks`: Lógica Compartida
- `useNavbar.js`: Controla el estado del buscador, apertura de menús y autenticación.
- `useVehicleFavorites.js`: Gestiona la persistencia de los favoritos de cada usuario en el servidor.

---

## 🗄️ API RESTful Versionada

La API utiliza el prefijo `/api/v1` (con retrocompatibilidad en `/api`).

### Endpoints Principales

| Recurso               | Método | Ruta                               | Descripción                     |
|------------------------|--------|------------------------------------|---------------------------------|
| Health Check           | GET    | `/`                                | Estado del servidor              |
| Login                  | POST   | `/api/v1/auth/login`               | Iniciar sesión                   |
| Register               | POST   | `/api/v1/auth/register`            | Registrar usuario                |
| Logout                 | POST   | `/api/v1/auth/logout`              | Cerrar sesión                    |
| Perfil                 | GET    | `/api/v1/auth/me`                  | Datos del usuario autenticado    |
| Listar vehículos       | GET    | `/api/v1/vehicles?page=1&limit=20` | Con paginación, filtros y orden  |
| Detalle vehículo       | GET    | `/api/v1/vehicles/:id`             | Vehículo por ID                  |
| Crear vehículo         | POST   | `/api/v1/vehicles`                 | 🔒 Requiere autenticación       |
| Listar usuarios        | GET    | `/api/v1/users`                    | 🔒 Solo admin                   |
| Chatbot IA             | POST   | `/api/v1/chatbot`                  | Consulta al asistente IA         |

### Paginación, Búsqueda y Filtros (Vehículos)

```
GET /api/v1/vehicles?search=toyota&type=SUV&fuel=Gasolina&minPrice=5000000&maxPrice=20000000&sort=price&order=ASC&page=1&limit=10
```

Respuesta:
```json
{
  "data": [...],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## 📊 Modelo de Datos (MySQL — SAVS_DB)
El sistema gestiona las siguientes entidades:
- **`Autos`**: Datos técnicos, precios, etiquetas de disponibilidad e imágenes.
- **`Usuarios`**: Perfiles con roles, credenciales, favoritos y datos de ubicación.
- **`Rols`**: Roles del sistema (admin, gerente, cliente).
- **`Requests`**: Solicitudes de contacto y cotizaciones.
- **`Reviews`**: Comentarios verificados de clientes con calificación.
- **`SaleRequests`**: Solicitudes de venta/intercambio de vehículos.
- **`Branches`**: Sucursales de la empresa.
- **`Settings`**: Configuración global del sitio (key-value).
- **`TechnicalGlossaries`**: Glosario técnico automotriz.

---

## 🚀 Funcionalidades Clave

### 🏠 Inicio Dinámico
- Carrusel infinito de marcas asociadas con efectos fluidos.
- Secciones de "Bestias del asfalto", "Poco Kilometraje" y más, filtradas automáticamente por lógica de negocio en el frontend.

### 🔍 Inventario Inteligente y Dinámico
- Vista detallada de vehículos (`VehicleDetails`) **100% dinámica**: especificaciones técnicas, rendimiento, galerías e íconos de características provenientes directamente de la base de datos (eliminación total de datos fijos/hardcodeados).
- Filtros avanzados por tipo de vehículo (SUV, Sedán, Pick-up, etc.), marca y rango de precios.
- **Paginación server-side** con metadatos de navegación.

### 👤 Área de Usuario y Perfil
- Registro y login seguro adaptado al diseño de la marca.
- Perfil personal donde el cliente puede gestionar favoritos, ver su información de contacto y añadir su ubicación exacta usando selectores de provincias de Costa Rica.

### 🚢 Seguimiento de Importaciones (Tracking)
- Panel en tiempo real para clientes mostrando la etapa de importación de su vehículo.
- **4 etapas definidas**: Compra Realizada, En Tránsito, En Aduanas y Entrega Final.
- Barra de progreso visual y notificaciones de fecha estimada, barco/naviera y ubicación actual.

### 🤖 Asistente Virtual (Chatbot)
- Bot conversacional integrado directamente en la interfaz.
- Potenciado por **Groq Cloud (LLaMA 3.3 70B)** con contexto del inventario real de MySQL.
- Derivación fluida a WhatsApp de ventas con mensaje personalizado para atención humana directa.

### ⚙️ Panel Administrativo Robusto (Portal SAVS)
- **Seguimiento (Tracking Admin)**: Nueva interfaz dedicada para que gerentes y admins actualicen los estados de importación de todos los clientes de manera centralizada.
- **Gestión Total**: CRUD de vehículos, revisión de reviews pendientes, administración de roles de usuarios y control de solicitudes de contacto.

---

## 🛡️ Seguridad

| Medida                        | Implementación                                  |
|-------------------------------|--------------------------------------------------|
| Hashing de contraseñas        | bcrypt con salt de 10 rondas                     |
| Tokens de sesión              | JWT con expiración de 24h en cookies HttpOnly    |
| Protección de rutas backend   | Middlewares `verificarToken` + `esAdmin`          |
| Protección de rutas frontend  | Componente `AdminRoute.jsx` con validación de rol |
| Validación de inputs          | Bloqueo global de caracteres no permitidos        |
| CORS restringido              | Solo orígenes explícitos permitidos               |

---

## 🧪 Testing

El proyecto incluye pruebas de integración con **Jest + Supertest** ubicadas en `backend/tests/api.test.js`:

```bash
cd backend
npm test
```

Las pruebas validan:
1. **Requisito Estructural**: El servidor responde correctamente en la ruta raíz.
2. **Caso de Éxito (Login)**: POST a `/api/login` retorna status 200 y genera cookie con token JWT.
3. **Restricción 401 (Seguridad)**: POST a `/api/autos` sin autenticación retorna 401.

---

## 🔧 Instalación y Ejecución

### Prerrequisitos
- Node.js v18+
- MySQL 8 con la base de datos `SAVS_DB` creada
- Variables de entorno configuradas en `backend/.env`

### 1. Instalar dependencias
```bash
npm install
cd backend && npm install
```

### 2. Configurar base de datos
```bash
cd backend
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all   # (opcional) datos iniciales
```

### 3. Ejecutar todo (Frontend + Backend)
```bash
npm run dev:full
```

Esto levanta simultáneamente:
- **Frontend** en `http://localhost:5173`
- **Backend API** en `http://localhost:5000`

### Comandos Individuales
```bash
npm run dev         # Solo frontend (Vite)
npm run backend     # Solo backend (Node.js)
npm run dev:full    # Ambos simultáneamente (concurrently)
```

---

## 🌐 Variables de Entorno

Crear el archivo `backend/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=<tu_contraseña_mysql>
DB_NAME=SAVS_DB
JWT_SECRET=<secreto_seguro_para_jwt>
GROQ_API_KEY=<tu_api_key_de_groq>
```

---

## 📱 Diseño Responsivo
La aplicación utiliza un sistema de `Navbar` híbrido que se transforma en un "Drawer" (menú lateral) en dispositivos móviles, asegurando que la navegación y el simulador de crédito sean accesibles en cualquier pantalla.

---
**Desarrollado para Importadora SAVS - Calidad y Confianza en cada kilómetro.**
