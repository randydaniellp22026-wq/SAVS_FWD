/**
 * PageLoader — Spinner de carga accesible para fallback de Suspense.
 * Se muestra mientras las rutas lazy-loaded se cargan.
 * Cumple WCAG con role="status" y aria-label descriptivo.
 */
import React from 'react';
import './PageLoader.module.css';

const PageLoader = ({ message = 'Cargando...' }) => {
  return (
    <div className="page-loader" role="status" aria-label={message}>
      <div className="page-loader__spinner" aria-hidden="true">
        {/* Anillo giratorio dorado */}
        <svg className="page-loader__svg" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
          <circle
            className="page-loader__circle"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="4"
          />
        </svg>
      </div>
      <span className="page-loader__text">{message}</span>
      {/* Texto oculto para lectores de pantalla */}
      <span className="sr-only">Contenido en proceso de carga, por favor espera.</span>
    </div>
  );
};

export default PageLoader;
