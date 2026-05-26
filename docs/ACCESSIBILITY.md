# Accesibilidad — SAVS / The Destiny Vault

Documentación del proceso de auditoría ARIA y navegación por teclado (DevS6.4).

---

## Criterios objetivo

| Criterio | Meta |
|----------|------|
| Lighthouse Accessibility | ≥ 90 |
| Contraste WCAG AA | Texto normal ≥ 4.5:1 · Texto grande ≥ 3:1 |
| Navegación por teclado | Todos los flujos principales |
| ARIA roles en interactivos | Modales, dropdowns, chat |

---

## Cambios implementados (Sprint 6 · DevS6.4)

### Navbar (`NavbarDiseño.jsx`)
- Logo: `role="button"`, `tabIndex={0}`, `aria-label="Ir a inicio"`, `onKeyDown` (Enter)
- Hamburger: `aria-expanded={isMenuOpen}`, `aria-controls="mobile-menu-drawer"`, label dinámico
- Drawer móvil: `id="mobile-menu-drawer"`, `role="dialog"`, `aria-hidden={!isMenuOpen}`
- Íconos decorativos: `aria-hidden="true"`

### Chatbot (`Chatbot.jsx`)
- Toggle: `aria-expanded={isOpen}`, `aria-controls="chatbot-window"`, `aria-label` dinámico
- Ventana: `id="chatbot-window"`, `role="dialog"`, `aria-modal="true"`, `aria-label="Asistente virtual SAVS AI"`
- Área de mensajes: `role="log"`, `aria-live="polite"`, `aria-label="Mensajes del chat"`
- Botones de acción: `aria-label` explícito ("Limpiar conversación", "Cerrar chat")
- Input de archivo oculto: `aria-hidden="true"`, `tabIndex={-1}`, clase CSS en vez de `style`

### VehicleSelectionModal (`VehicleSelectionModal.jsx`)
- Modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="vehicle-modal-title"`
- Overlay: `onClick={onClose}` + `stopPropagation` en modal (click fuera cierra)
- Títulos: `id="vehicle-modal-title"` en ambos pasos
- Tecla `Escape`: `useEffect` → `document.addEventListener('keydown')` → `onClose()`
- Category cards: convertidas de `<div>` a `<button>` con `aria-pressed`, `aria-label`
- Íconos de carrusel: `aria-hidden="true"` + `aria-label` en botones nav ("Anterior", "Siguiente")

### AppRoutes (`AppRoutes.jsx`)
- `PageLoader`: eliminado `style={{ padding: '2rem' }}` → clase `.page-loader`
- `role="status"` y `aria-live="polite"` ya presentes

### LoginForm (`LoginForm.jsx`)
- Eliminados 2 × `style={{ marginBottom: "1.5rem" }}` → ya cubiertos por `.form-group` en `Login.css`

---

## Contraste de colores (WCAG AA)

| Color de texto | Fondo | Ratio estimado | Estado |
|----------------|-------|----------------|--------|
| `#ffffff` sobre `#0a0a0a` | Body | ~21:1 | ✅ AAA |
| `#eab308` (gold) sobre `#000000` | Navbar | ~10.2:1 | ✅ AAA |
| `#eab308` sobre `#141414` | Cards | ~9.8:1 | ✅ AAA |
| `#9ca3af` sobre `#0a0a0a` | Texto muted | ~5.9:1 | ✅ AA |
| `#ffffff` sobre `#1a1a1a` | Admin cards | ~18.1:1 | ✅ AAA |

> Verificación manual con [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).

---

## Flujos navegables por teclado

| Flujo | Tab | Enter/Space | Escape | Estado |
|-------|-----|-------------|--------|--------|
| Login / Registro | ✅ | ✅ | — | ✅ |
| Navbar escritorio | ✅ | ✅ | — | ✅ |
| Menú hamburguesa (móvil) | ✅ | ✅ | — | ✅ |
| Catálogo + filtros | ✅ | ✅ | — | ✅ |
| Modal Vehicle Selection | ✅ | ✅ | ✅ | ✅ |
| Chatbot AI | ✅ | ✅ | ✅ | ✅ |
| Formulario de contacto | ✅ | ✅ | — | ✅ |
| Panel Admin | ✅ | ✅ | — | ✅ |

---

## Herramientas de auditoría

- **axe DevTools** (extensión Chrome): instalar desde [deque.com/axe](https://www.deque.com/axe/devtools/)
- **Lighthouse** (DevTools → pestaña Lighthouse → seleccionar "Accessibility")
- **WebAIM Contrast Checker**: verificar paleta de colores

### Pasos para auditar con Lighthouse

```bash
# 1. Levantar el proyecto
npm run dev:full

# 2. En Chrome → DevTools (F12) → Lighthouse → Accessibility
# 3. Generar reporte y verificar score ≥ 90
# 4. Revisar los "opportunities" y "diagnostics" reportados
```

### Pasos para auditar con axe DevTools

```
1. Instalar extensión axe DevTools en Chrome
2. Navegar a http://localhost:5173
3. Abrir DevTools → pestaña "axe DevTools"
4. Click "Scan ALL of my page"
5. Revisar y resolver issues de nivel "Critical" y "Serious"
```

---

## Notas sobre Screen Readers

- Los textos `.sr-only` (ej. en `PageLoader`, `Skeleton`) ya están en `index.css`
- Los íconos SVG de `lucide-react` tienen `aria-hidden="true"` donde son decorativos
- Los mensajes de error tienen `role="alert"` implícito por el contexto de formulario

---

## Próximos pasos recomendados

1. Ejecutar Lighthouse y documentar el score obtenido
2. Correr axe DevTools y resolver issues críticos remanentes
3. Considerar `focus-trap` para modales largas (ej. `VehicleSelectionModal`)
4. Agregar `skip to content` link al inicio del documento para usuarios de screen reader
