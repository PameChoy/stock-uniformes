//hace peticiones al backend para obtener información sobre entregas

import { API_URL } from "../config/api";
import type { Entrega, EstadoEntrega } from "../types/entrega";

function obtenerMensajeError(data: unknown, estadoHttp: number) {
  if (typeof data === "object" && data !== null && "message" in data) {
    const mensaje = data.message;

    if (typeof mensaje === "string") {
      return mensaje;
    }

    if (Array.isArray(mensaje)) {
      return mensaje.join(" ");
    }
  }

  return `No se pudieron consultar las entregas (error ${estadoHttp}).`;
}

export async function listarEntregas(
  estado?: EstadoEntrega,
  signal?: AbortSignal,
): Promise<Entrega[]> {
  const parametros = new URLSearchParams();

  if (estado) {
    parametros.set("estado", estado);
  }

  const query = parametros.toString();
  const url = `${API_URL}/entregas${query ? `?${query}` : ""}`;
  const respuesta = await fetch(url, { signal });
  const data: unknown = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    throw new Error(obtenerMensajeError(data, respuesta.status));
  }

  if (!Array.isArray(data)) {
    throw new Error("El backend no devolvió una lista de entregas.");
  }

  return data as Entrega[];
}
