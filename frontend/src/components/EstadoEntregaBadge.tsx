import type { EstadoEntrega } from '../types/entrega';

const etiquetas: Record<EstadoEntrega, string> = {
  PREPARADA: 'Preparada',
  ENTREGADA: 'Entregada',
  CANCELADA: 'Cancelada',
};

interface EstadoEntregaBadgeProps {
  estado: EstadoEntrega;
}

export function EstadoEntregaBadge({ estado }: EstadoEntregaBadgeProps) {
  return (
    <span className={`estado-badge estado-badge--${estado.toLowerCase()}`}>
      {etiquetas[estado]}
    </span>
  );
}
