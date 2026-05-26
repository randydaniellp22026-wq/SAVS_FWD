/**
 * @file PerfilPeticiones.jsx
 * @description Componente que renderiza el historial y estado de peticiones del usuario
 * (consultas de contacto y solicitudes de intercambio/trade-in).
 * Muestra insignias de estado y permite abrir un cuadro de diálogo para ver las respuestas.
 */

import React from 'react';
import { Clock, Send } from 'lucide-react';
import Swal from 'sweetalert2';
import styles from './PerfilPeticiones.module.css';

const PerfilPeticiones = ({ userRequests }) => {
  return (
    <section className="requests-user-section" aria-labelledby="requests-title">
      <h2 id="requests-title">Estado de mis Peticiones</h2>
      {userRequests.length === 0 ? (
        <div className={styles.emptyContainer}>
          No tienes peticiones activas. Ve a la sección de contacto para enviar una.
        </div>
      ) : (
        <div className={styles.requestsList}>
          {userRequests.map((req) => {
            const isApproved = req.status === 'accepted' || req.status === 'Aprobado';
            const isRejected = req.status === 'rejected' || req.status === 'Rechazado';
            const isReplied = req.status === 'replied' || (req.reply && req.status === 'pending');

            let badgeText = 'Pendiente';
            let badgeColor = '#eab308';
            let bgBadge = 'rgba(234, 179, 8, 0.2)';

            if (isApproved) {
              badgeText = 'Aprobada';
              badgeColor = '#10b981';
              bgBadge = 'rgba(16, 185, 129, 0.2)';
            } else if (isRejected) {
              badgeText = 'Rechazada';
              badgeColor = '#ef4444';
              bgBadge = 'rgba(239, 68, 68, 0.2)';
            } else if (isReplied) {
              badgeText = 'Respondida';
              badgeColor = '#3b82f6';
              bgBadge = 'rgba(59, 130, 246, 0.2)';
            }

            return (
              <div key={`${req.type}-${req.id}`} className={styles.requestCard}>
                <div className={styles.headerRow}>
                  <div>
                    <span className={styles.typeText}>
                      {req.type === 'tradein' ? 'Venta de Auto (Trade-in)' : 'Consulta General'}
                    </span>
                    <h3 className={styles.subjectText}>{req.subject}</h3>
                  </div>
                  <span
                    className={styles.statusBadge}
                    style={{ backgroundColor: bgBadge, color: badgeColor }}
                  >
                    {badgeText}
                  </span>
                </div>

                <p className={styles.messageText}>"{req.message}"</p>

                <div className={styles.footerRow}>
                  <div className={styles.dateWrapper}>
                    <Clock size={14} aria-hidden="true" />
                    <span className={styles.dateText}>
                      {new Date(req.date).toLocaleDateString()}
                    </span>
                  </div>

                  {req.reply && (
                    <button
                      onClick={() => {
                        Swal.fire({
                          title: 'Respuesta de Administración',
                          text: req.reply,
                          icon: 'info',
                          confirmButtonText: 'Entendido',
                          confirmButtonColor: '#eab308',
                          background: '#141414',
                          color: '#fff',
                        });
                      }}
                      className={styles.replyBtn}
                      aria-label={`Ver respuesta de administración para la petición ${req.subject}`}
                    >
                      <Send size={14} aria-hidden="true" /> Ver Respuesta
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default PerfilPeticiones;
