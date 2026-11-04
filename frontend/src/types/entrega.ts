export type EstadoEntrega = 'PREPARADA' | 'ENTREGADA' | 'CANCELADA';

export interface EmpleadoResumen {
  id: string;
  nombre: string;
  apellido: string;
}

export interface PrendaResumen {
  nombre: string;
}

export interface VariantePrendaResumen {
  id: string;
  talle: string | null;
  color: string | null;
  prenda: PrendaResumen;
}

export interface DetalleEntrega {
  id: string;
  cantidad: number;
  variantePrenda: VariantePrendaResumen;
}

export interface Entrega {
  id: string;
  estado: EstadoEntrega;
  fechaEntrega: string | null;
  fechaPreparacion: string;
  observacion: string | null;
  planillaFirmada: boolean;
  fechaFirmaPlanilla: string | null;
  empleado: EmpleadoResumen;
  detalles: DetalleEntrega[];
}
