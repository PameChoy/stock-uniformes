import { useEffect, useState } from "react";
import { EstadoEntregaBadge } from "../components/EstadoEntregaBadge";
import { listarEntregas } from "../services/entregas.service";
import type { Entrega, EstadoEntrega } from "../types/entrega";

const formatoFecha = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatearFecha(fecha: string | null) {
  return fecha ? formatoFecha.format(new Date(fecha)) : "—";
}

function describirVariante(detalle: Entrega["detalles"][number]) {
  const datos = [
    detalle.variantePrenda.talle
      ? `Talle ${detalle.variantePrenda.talle}`
      : null,
    detalle.variantePrenda.color,
  ].filter(Boolean);

  return datos.length > 0 ? datos.join(" · ") : "Sin talle ni color";
}

//prop es un dato que un componente de React recibe desde afuera (desde otro archivo tmb)
//type se usa para darle un nombre a la forma de los datos que recibe el componente
type EntregasPageProps = { estadoFijo?: EstadoEntrega };

export function EntregasPage({ estadoFijo }: EntregasPageProps) {
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<
    EstadoEntrega | ""
  >("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recarga, setRecarga] = useState(0);
  const [entregaAbierta, setEntregaAbierta] = useState<string | null>(null);

  const estadoConsulta = estadoFijo ?? estadoSeleccionado;

  useEffect(() => {
    const controller = new AbortController();

    async function cargar() {
      setCargando(true);
      setError(null);

      try {
        const resultado = await listarEntregas(
          estadoConsulta || undefined,
          controller.signal, //es la señal que le permite a fetch saber si tiene que cancelar una consulta que sigue en curso
        );
        setEntregas(resultado);
      } catch (errorDesconocido) {
        if (controller.signal.aborted) return;

        setError(
          errorDesconocido instanceof Error
            ? errorDesconocido.message
            : "Ocurrió un error inesperado.",
        );
      } finally {
        if (!controller.signal.aborted) setCargando(false);
      }
    }

    void cargar();
    return () => controller.abort();
  }, [estadoConsulta, recarga]);

  return (
    <main className="app-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Sistema de stock de uniformes</p>
          <h1>Entregas</h1>
          <p className="page-description">
            Consultá las entregas preparadas, completadas y canceladas.
          </p>
        </div>

        <div className="summary-card" aria-live="polite">
          <span className="summary-card__value">
            {cargando ? "…" : entregas.length}
          </span>
          <span className="summary-card__label">resultados visibles</span>
        </div>
      </header>

      <section className="panel" aria-labelledby="listado-entregas">
        <div className="toolbar">
          <div>
            <h2 id="listado-entregas">Listado de entregas</h2>
            <p>Ordenadas desde la preparación más reciente.</p>
          </div>

          <div className="toolbar__actions">
            {!estadoFijo && (
              <label className="filter-control">
                <span>Estado</span>
                <select
                  value={estadoSeleccionado}
                  onChange={(event) => {
                    setEstadoSeleccionado(
                      event.target.value as EstadoEntrega | "",
                    );
                    setEntregaAbierta(null);
                  }}
                >
                  <option value="">Todos</option>
                  <option value="PREPARADA">Preparadas</option>
                  <option value="ENTREGADA">Entregadas</option>
                  <option value="CANCELADA">Canceladas</option>
                </select>
              </label>
            )}

            <button
              className="button button--secondary"
              type="button"
              onClick={() => setRecarga((valor) => valor + 1)}
              disabled={cargando}
            >
              Actualizar
            </button>
          </div>
        </div>

        {cargando && (
          <div className="feedback" role="status">
            <span className="spinner" aria-hidden="true" />
            Cargando entregas…
          </div>
        )}

        {!cargando && error && (
          <div className="feedback feedback--error" role="alert">
            <div>
              <strong>No pudimos cargar las entregas.</strong>
              <p>{error}</p>
            </div>
            <button
              className="button button--secondary"
              type="button"
              onClick={() => setRecarga((valor) => valor + 1)}
            >
              Reintentar
            </button>
          </div>
        )}

        {!cargando && !error && entregas.length === 0 && (
          <div className="feedback">
            No hay entregas para el estado seleccionado.
          </div>
        )}

        {!cargando && !error && entregas.length > 0 && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Empleado</th>
                  <th>Preparación</th>
                  <th>Estado</th>
                  <th>Prendas</th>
                  <th aria-label="Acciones" />
                </tr>
              </thead>
              <tbody>
                {entregas.map((entrega) => {
                  const estaAbierta = entregaAbierta === entrega.id;
                  const cantidadTotal = entrega.detalles.reduce(
                    (total, detalle) => total + detalle.cantidad,
                    0,
                  );

                  return (
                    <tr className="delivery-row" key={entrega.id}>
                      <td data-label="Empleado">
                        <strong>
                          {entrega.empleado.nombre} {entrega.empleado.apellido}
                        </strong>
                      </td>
                      <td data-label="Preparación">
                        {formatearFecha(entrega.fechaPreparacion)}
                      </td>
                      <td data-label="Estado">
                        <EstadoEntregaBadge estado={entrega.estado} />
                      </td>
                      <td data-label="Prendas">
                        {cantidadTotal}{" "}
                        {cantidadTotal === 1 ? "unidad" : "unidades"}
                      </td>
                      <td className="action-cell">
                        <button
                          className="text-button"
                          type="button"
                          aria-expanded={estaAbierta}
                          onClick={() =>
                            setEntregaAbierta(estaAbierta ? null : entrega.id)
                          }
                        >
                          {estaAbierta ? "Ocultar" : "Ver detalle"}
                        </button>

                        {estaAbierta && (
                          <div className="delivery-detail">
                            <div className="delivery-detail__meta">
                              <span>
                                <strong>Fecha de entrega:</strong>{" "}
                                {formatearFecha(entrega.fechaEntrega)}
                              </span>
                              <span>
                                <strong>Planilla firmada:</strong>{" "}
                                {entrega.planillaFirmada ? "Sí" : "No"}
                              </span>
                            </div>

                            <ul className="items-list">
                              {entrega.detalles.map((detalle) => (
                                <li key={detalle.id}>
                                  <div>
                                    <strong>
                                      {detalle.variantePrenda.prenda.nombre}
                                    </strong>
                                    <span>{describirVariante(detalle)}</span>
                                  </div>
                                  <span className="item-quantity">
                                    × {detalle.cantidad}
                                  </span>
                                </li>
                              ))}
                            </ul>

                            {entrega.observacion && (
                              <p className="observation">
                                <strong>Observación:</strong>{" "}
                                {entrega.observacion}
                              </p>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
