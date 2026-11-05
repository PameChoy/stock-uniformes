//Un tipo describe la forma que esperamos que tengan los datos
export interface Empleado {
  id: string;
  nombre: string;
  apellido: string;
  cuil: string;
  puesto: string | null;
  activo: boolean;
}
