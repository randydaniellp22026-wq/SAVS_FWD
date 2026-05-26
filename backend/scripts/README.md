# Scripts y Utilidades de Consola (CLI)

Este directorio contiene herramientas de línea de comandos y utilidades internas para el mantenimiento y administración del backend.

## Índice de Scripts

| Script                     | Propósito / Uso                                                                                |
| :------------------------- | :--------------------------------------------------------------------------------------------- |
| `migrate_json_to_mysql.js` | Migra los datos heredados en formato JSON (`db.json`) hacia la base de datos relacional MySQL. |
| `migrate-tracking-data.js` | Adapta y migra datos antiguos de seguimiento y citas a la estructura actual.                   |
| `fix-passwords.js`         | Encripta masivamente con `bcrypt` las contraseñas en texto plano de los usuarios importados.   |
| `reset_pass.js`            | Permite restablecer manualmente la contraseña de cualquier usuario administrador o cliente.    |
| `fix_managers.js`          | Utilidad para corregir la asignación de relaciones de administradores y roles en la DB.        |
| `check_db_temp.js`         | Comprobación de estado temporal y conexiones activas a la base de datos de pruebas.            |
| `find_prompt.js`           | Herramienta de auditoría interna de prompts y configuraciones de LLM.                          |
| `list_all_files.js`        | Utilidad rápida para auditoría de archivos de assets e imágenes subidas en el servidor.        |
| `test_groq.js`             | Test de humo para verificar la integración y latencia de la API de Groq Cloud.                 |
| `test_generate_copy.js`    | Validación local del pipeline de generación de textos creativos y banners publicitarios.       |

---

## Cómo Ejecutar los Scripts

Para ejecutar cualquiera de estos scripts, sitúate en el directorio `backend` y ejecuta:

```bash
node scripts/<nombre-del-script>.js
```

Por ejemplo, para re-encriptar contraseñas:

```bash
node scripts/fix-passwords.js
```
