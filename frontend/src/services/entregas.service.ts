//Hace peticiones al backend para consultar y actualizar entregas.

import { API_URL } from "../config/api";
import type { Entrega, EstadoEntrega } from "../types/entrega";

function obtenerMensajeError(
  data: unknown,
  estadoHttp: number,
  mensajePorDefecto = "No se pudieron consultar las entregas",
) {
  if (typeof data === "object" && data !== null && "message" in data) {
    const mensaje = data.message;

    if (typeof mensaje === "string") {
      return mensaje;
    }

    if (Array.isArray(mensaje)) {
      return mensaje.join(" ");
    }
  }

  return `${mensajePorDefecto} (error ${estadoHttp}).`;
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

export async function marcarComoEntregada(
  entregaId: string,
  planillaFirmada: boolean,
): Promise<void> {
  //La promesa, al completarse, no entrega un valor.
  const respuesta = await fetch(`${API_URL}/entregas/${entregaId}/entregar`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ planillaFirmada }),
  });

  if (!respuesta.ok) {
    const datos: unknown = await respuesta.json().catch(() => null);
    throw new Error(
      obtenerMensajeError(datos, respuesta.status, "No se pudo confirmar la entrega",),
    );
  }
}

export async function registrarFirmaPlanilla(entregaId: string): Promise<void> {
  const respuesta = await fetch(
    `${API_URL}/entregas/${entregaId}/firmar-planilla`,
    { method: "PATCH" },
  );

  if (!respuesta.ok) {
    const datos: unknown = await respuesta.json().catch(() => null);
    throw new Error(
      obtenerMensajeError(datos, respuesta.status, "No se pudo registrar la firma",),
    );
  }
}
