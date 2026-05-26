import styles from './Skeleton.module.css';

export default function Skeleton({ className = '', width, height, variant = 'rect' }) {
  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      className={`${styles.skeleton} ${styles[variant] || ''} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

export function CatalogSkeletonGrid({ count = 6 }) {
  return (
    <div className={styles.grid} role="status" aria-label="Cargando catálogo">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.card}>
          <Skeleton variant="rect" height="180px" />
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="40%" />
        </div>
      ))}
    </div>
  );
}
