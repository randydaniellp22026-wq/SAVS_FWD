import { Clock, Send } from 'lucide-react';
import Swal from 'sweetalert2';
import styles from './PerfilSections.module.css';

function getStatusBadge(req) {
  const isApproved = req.status === 'accepted' || req.status === 'Aprobado';
  const isRejected = req.status === 'rejected' || req.status === 'Rechazado';
  const isReplied = req.status === 'replied' || (req.reply && req.status === 'pending');

  if (isApproved) return { text: 'Aprobada', color: '#10b981', bg: 'rgba(16,185,129,0.2)' };
  if (isRejected) return { text: 'Rechazada', color: '#ef4444', bg: 'rgba(239,68,68,0.2)' };
  if (isReplied) return { text: 'Respondida', color: '#3b82f6', bg: 'rgba(59,130,246,0.2)' };
  return { text: 'Pendiente', color: '#eab308', bg: 'rgba(234,179,8,0.2)' };
}

export default function PurchaseHistorySection({ userRequests }) {
  return (
    <section className="requests-user-section" aria-labelledby="requests-heading">
      <h2 id="requests-heading">Estado de mis Peticiones</h2>
      {userRequests.length === 0 ? (
        <div className={styles.emptyRequests}>
          No tienes peticiones activas. Ve a la sección de contacto para enviar una.
        </div>
      ) : (
        <div className={styles.requestsList}>
          {userRequests.map((req) => {
            const badge = getStatusBadge(req);
            return (
              <article key={`${req.type}-${req.id}`} className={styles.requestCard}>
                <div className={styles.requestHeader}>
                  <div>
                    <span className={styles.requestType}>
                      {req.type === 'tradein' ? 'Venta de Auto (Trade-in)' : 'Consulta General'}
                    </span>
                    <h3 className={styles.requestSubject}>{req.subject}</h3>
                  </div>
                  <span
                    className={styles.badge}
                    style={{ backgroundColor: badge.bg, color: badge.color }}
                  >
                    {badge.text}
                  </span>
                </div>
                <p className={styles.requestMessage}>&quot;{req.message}&quot;</p>
                <div className={styles.requestFooter}>
                  <div className={styles.requestDate}>
                    <Clock size={14} aria-hidden="true" />
                    <span>{new Date(req.date).toLocaleDateString()}</span>
                  </div>
                  {req.reply && (
                    <button
                      type="button"
                      className={styles.replyBtn}
                      onClick={() =>
                        Swal.fire({
                          title: 'Respuesta de Administración',
                          text: req.reply,
                          icon: 'info',
                          confirmButtonText: 'Entendido',
                          confirmButtonColor: '#eab308',
                          background: '#141414',
                          color: '#fff',
                        })
                      }
                    >
                      <Send size={14} aria-hidden="true" /> Ver Respuesta
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
