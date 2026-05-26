# Guía de Migración de Rutas (API Versioning)

Este documento detalla el mapeo completo de las rutas heredadas (deprecated) hacia la nueva arquitectura de API Versionada de **The Destiny Vault** en la versión `/api/v1/*`.

## Resumen del Cambio

Para garantizar la escalabilidad, la mantenibilidad y el versionado seguro del backend, todas las rutas heredadas han sido migradas y consolidadas bajo el prefijo `/api/v1/`.

- **Rutas Nuevas**: Responden bajo `/api/v1/*` y retornan el encabezado `X-API-Version: 1.0`.
- **Rutas Heredadas (Legacy)**: Permanecen activas para retrocompatibilidad, pero retornan los encabezados de deprecación para notificar al cliente que actualice su endpoint:
  - `Deprecation: true`
  - `X-Deprecated-Redirect: /api/v1/<nueva-ruta>`

---

## Tabla de Mapeo de Rutas

| Ruta Antigua (Legacy)       | Nueva Ruta (v1)                | Descripción                                                                   |
| :-------------------------- | :----------------------------- | :---------------------------------------------------------------------------- |
| `/api/auth/*`               | `/api/v1/auth/*`               | Autenticación de usuarios, login y registro                                   |
| `/api/users/*`              | `/api/v1/users/*`              | Gestión de cuentas de usuario, clientes y personal                            |
| `/api/vehicles/*`           | `/api/v1/vehicles/*`           | Listado, filtros y CRUD del catálogo de autos                                 |
| `/api/reviews/*`            | `/api/v1/reviews/*`            | Sistema de valoraciones y comentarios de clientes                             |
| `/api/requests/*`           | `/api/v1/requests/*`           | Solicitudes generales de clientes y contactos                                 |
| `/api/sale_requests/*`      | `/api/v1/sale_requests/*`      | Solicitudes de consignación e importación de autos                            |
| `/api/branches/*`           | `/api/v1/branches/*`           | Listado y administración de sucursales físicas                                |
| `/api/technical_glossary/*` | `/api/v1/technical_glossary/*` | Glosario técnico de especificaciones mecánicas                                |
| `/api/settings/*`           | `/api/v1/settings/*`           | Parámetros globales y configuración del sistema                               |
| `/api/chatbot/*`            | `/api/v1/chatbot/*`            | Consultas inteligentes de asistente de IA (LLM)                               |
| `/api/marketing/*`          | `/api/v1/marketing/*`          | Campañas y newsletters para clientes                                          |
| `/api/appointments/*`       | `/api/v1/appointments/*`       | Agendamiento de citas de test drive y mantenimiento                           |
| `/api/points/*`             | `/api/v1/points/*`             | Consultas del programa de fidelización y puntos                               |
| `/api/v1/health`            | `/api/v1/health`               | Monitoreo del estado del backend (retorna `{ status: 'ok', version: '1.0' }`) |

---

## Headers del Protocolo de Deprecación

Al realizar peticiones a los endpoints antiguos, los clientes recibirán los siguientes metadatos en los encabezados HTTP:

```http
HTTP/1.1 200 OK
X-API-Version: 1.0
Deprecation: true
X-Deprecated-Redirect: /api/v1/vehicles
Content-Type: application/json
```

Se aconseja a los desarrolladores de frontend migrar sus llamadas Axios utilizando el nuevo prefijo `/api/v1/` lo antes posible para evitar interrupciones en futuros ciclos de release donde la capa de compatibilidad heredada sea removida.
