//El servicio hace la petición al backend usando fetch,
//obtiene la respuesta y maneja errores de la consulta.

import { API_URL } from "../config/api"; //para pedir GET/empleados
//API_URL guarda la dirección del backend http://localhost:3000
import type { Empleado } from "../types/empleado";

export async function listarEmpleados(
  signal?: AbortSignal, //Es un parámetro opcional que recibe una señal para cancelar la consulta.
): Promise<Empleado[]> {
  //Promise: representa un resultado que estará disponible cuando termine la operación.
  //Cuando usamos fetch sin indicar un método, utiliza GET por defecto
  const respuesta = await fetch(`${API_URL}/empleados`, {
    signal,
  });

  //ok es una propiedad del objeto que devuelve Fetch, indica si la respuesta fue exitosa (códigos 200-299)
  //cubre los errores HTTP
  if (!respuesta.ok) {
    throw new Error(
      `No se pudieron cargar los empleados (error ${respuesta.status}).`,
    );
  }
  //Leé el contenido de la respuesta como JSON; si falla, usá null, y guardá el resultado en datos
  //cubre los errores de lectura del JSON
  const datos: unknown = await respuesta.json().catch(() => null);

  //verificamos si realmente llegó una lista
  if (!Array.isArray(datos)) {
    throw new Error("El backend no devolvió una lista de empleados.");
  }

  return datos as Empleado[];
}
