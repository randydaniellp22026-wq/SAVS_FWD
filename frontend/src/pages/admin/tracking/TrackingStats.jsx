import { Ship, User, AlertCircle, Clock } from 'lucide-react';
import styles from './TrackingStats.module.css';

export default function TrackingStats({ users }) {
  const clientsWithTracking = users.filter((u) => u.tracking?.vehicleName).length;
  const clientsWithoutTracking = users.length - clientsWithTracking;

  const kpis = [
    { label: 'Total Clientes', value: users.length, icon: User, color: '#3b82f6' },
    { label: 'Con Tracking Activo', value: clientsWithTracking, icon: Ship, color: '#10b981' },
    { label: 'Sin Tracking Asignado', value: clientsWithoutTracking, icon: AlertCircle, color: '#ef4444' },
    {
      label: 'En Aduanas',
      value: users.filter((u) => u.tracking?.importStatus === 3).length,
      icon: Clock,
      color: '#eab308',
    },
  ];

  return (
    <div className={styles.grid}>
      {kpis.map((k) => (
        <div key={k.label} className={styles.card}>
          <div className={styles.icon} style={{ '--kpi-color': k.color }}>
            <k.icon size={22} />
          </div>
          <div>
            <div className={styles.value}>{k.value}</div>
            <div className={styles.label}>{k.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
