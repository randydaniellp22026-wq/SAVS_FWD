import { useNavigate } from 'react-router-dom';
import styles from './ErrorFallback.module.css';

export default function ErrorFallback({ error, resetErrorBoundary, title }) {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper} role="alert">
      <h1 className={styles.title}>{title || 'Algo salió mal'}</h1>
      <p className={styles.message}>
        Ocurrió un error inesperado. Puedes intentar recargar la página o volver al inicio.
      </p>
      {import.meta.env.DEV && error?.message && (
        <pre className={styles.detail}>{error.message}</pre>
      )}
      <div className={styles.actions}>
        <button type="button" className={styles.primary} onClick={resetErrorBoundary}>
          Recargar sección
        </button>
        <button type="button" className={styles.secondary} onClick={() => navigate('/')}>
          Ir al inicio
        </button>
      </div>
    </div>
  );
}
