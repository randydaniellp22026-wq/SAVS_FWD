import {
  ChevronDown,
  ChevronUp,
  Mail,
  Package,
  Edit3,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { stageBadge } from './trackingConstants';
import TrackingMap from './TrackingMap';
import styles from './TrackingHistory.module.css';

export default function TrackingHistory({
  users,
  expanded,
  onToggleExpand,
  onEditTracking,
}) {
  if (users.length === 0) {
    return (
      <div className={styles.empty}>
        <AlertCircle size={40} aria-hidden="true" />
        <p>No se encontraron clientes con esos criterios.</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {users.map((user) => {
        const t = user.tracking || {};
        const hasTrack = !!t.vehicleName;
        const isOpen = expanded === user.id;

        return (
          <div key={user.id} className={`${styles.card} ${isOpen ? styles.expanded : ''}`}>
            <div
              className={styles.header}
              onClick={() => onToggleExpand(isOpen ? null : user.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onToggleExpand(isOpen ? null : user.id);
                }
              }}
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
            >
              <div className={styles.avatar}>
                {user.image ? (
                  <img src={user.image} alt="" />
                ) : (
                  user.nombre?.charAt(0) || 'U'
                )}
              </div>
              <div className={styles.info}>
                <div className={styles.name}>{user.nombre}</div>
                <div className={styles.email}>
                  <Mail size={12} aria-hidden="true" /> {user.email}
                </div>
              </div>
              <div className={styles.vehicle}>
                {hasTrack ? (
                  <>
                    <div className={styles.vehicleName}>
                      <Package size={13} className="icon-gold" aria-hidden="true" />
                      {t.vehicleName}
                    </div>
                    <div>{stageBadge(t.importStatus)}</div>
                  </>
                ) : (
                  <span className={styles.noTracking}>Sin tracking</span>
                )}
              </div>
              <div className={styles.chevron} aria-hidden="true">
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>

            {isOpen && (
              <div className={styles.panel}>
                {hasTrack ? (
                  <>
                    <div className={styles.progressSection}>
                      <div className={styles.progressLabel}>Progreso de importación</div>
                      <TrackingMap step={t.importStatus || 0} />
                    </div>
                    <div className={styles.detailsGrid}>
                      {[
                        { label: 'Fecha Estimada', value: t.estimatedDate || 'N/A' },
                        { label: 'Ubicación', value: t.location || 'N/A' },
                        { label: 'Barco / Naviera', value: t.vessel || 'N/A' },
                        { label: 'Estado', value: t.statusText || 'N/A' },
                      ].map((d) => (
                        <div key={d.label} className={styles.detailBox}>
                          <div className={styles.detailLabel}>{d.label}</div>
                          <div className={styles.detailValue}>{d.value}</div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className={styles.noTrackingMsg}>
                    Este cliente aún no tiene información de importación asignada.
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => onEditTracking(user)}
                  className={styles.updateBtn}
                >
                  <Edit3 size={16} aria-hidden="true" />
                  {hasTrack ? 'Actualizar Tracking' : 'Asignar Tracking'}
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
