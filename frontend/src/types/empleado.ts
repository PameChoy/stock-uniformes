//Un tipo describe la forma que esperamos que tengan los datos
export interface Empleado { //Empleado describe el registro que devuelve el backend, que ya incluye id y activo
  id: string;
  nombre: string;
  apellido: string;
  cuil: string;
  puesto: string | null;
  activo: boolean;
}

export interface DatosCrearEmpleado { //DatosCrearEmpleado describe lo que mando
  nombre: string;
  apellido: string;
  cuil: string;
  puesto?: string;
}