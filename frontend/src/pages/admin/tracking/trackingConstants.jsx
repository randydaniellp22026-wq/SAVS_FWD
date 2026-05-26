import { Check, Ship, Clock, MapPin } from 'lucide-react';

export const STAGES = [
  { step: 1, label: 'Compra Realizada', icon: Check, color: '#10b981', statusText: 'Compra procesada correctamente' },
  { step: 2, label: 'En Tránsito', icon: Ship, color: '#3b82f6', statusText: 'Vehículo en tránsito marítimo' },
  { step: 3, label: 'En Aduanas', icon: Clock, color: '#eab308', statusText: 'En trámite aduanal' },
  { step: 4, label: 'Entrega Final', icon: MapPin, color: '#a855f7', statusText: 'Listo para entrega al cliente' },
];

export function stageBadge(step) {
  const s = STAGES.find((x) => x.step === step);
  if (!s) return null;
  return (
    <span className={`stage-badge stage-${step}`}>
      <s.icon size={13} /> {s.label}
    </span>
  );
}
