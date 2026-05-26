/**
 * DefaultErrorUI — Pantalla de error amigable con opciones de recuperación.
 * Se usa como fallback predeterminado del ErrorBoundary.
 * Incluye botones de reintentar y recargar página.
 */
import React from 'react';
import './DefaultErrorUI.css';

const DefaultErrorUI = ({ error, onRetry }) => {
  return (
    <div className="error-ui" role="alert" aria-live="assertive">
      <div className="error-ui__icon" aria-hidden="true">
        {/* Icono de advertencia SVG */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="error-ui__svg"
        >
          <path
            d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h2 className="error-ui__title">¡Algo salió mal!</h2>
      <p className="error-ui__message">
        Ha ocurrido un error inesperado. No te preocupes, puedes intentar recargar la sección o
        volver al inicio.
      </p>

      {/* Detalle técnico del error (modo desarrollo) */}
      {error && import.meta.env.DEV && (
        <details className="error-ui__details">
          <summary>Detalles técnicos</summary>
          <pre className="error-ui__stack">
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}

      <div className="error-ui__actions">
        {onRetry && (
          <button
            type="button"
            className="error-ui__btn error-ui__btn--retry"
            onClick={onRetry}
            aria-label="Reintentar carga de la sección"
          >
            🔄 Reintentar
          </button>
        )}
        <button
          type="button"
          className="error-ui__btn error-ui__btn--reload"
          onClick={() => window.location.reload()}
          aria-label="Recargar la página completa"
        >
          ↻ Recargar página
        </button>
        <button
          type="button"
          className="error-ui__btn error-ui__btn--home"
          onClick={() => (window.location.href = '/')}
          aria-label="Ir a la página de inicio"
        >
          🏠 Ir al inicio
        </button>
      </div>
    </div>
  );
};

export default DefaultErrorUI;
