//.tsx permite escribir JSX, la sintaxis que usamos en React
// para describir la interfaz: títulos, botones, tablas y componentes.
import { useState, useEffect } from "react";
import { listarEmpleados } from "../services/empleados.service";
import type { Empleado } from "../types/empleado";

type EstadoFiltro = "todos" | "activos" | "inactivos";

export function EmpleadosPage() {
  //definimos los estados de la pantalla, que son variables que cambian con el tiempo y
  // que hacen que la pantalla se vuelva a renderizar cuando cambian
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoFiltro>("todos");

  //useEffect permite ejecutar una accion cuando la pantalla aparece por primera vez, o cuando cambian ciertas variables
  useEffect(() => {
    //controlador de cancelacion de la peticion
    const controller = new AbortController();
    //Esta función debe ser asíncrona porque esperará la respuesta de listarEmpleados.
    async function cargar() {
      setCargando(true);
      setError(null);
      try {
        const resultado = await listarEmpleados(controller.signal);
        setEmpleados(resultado);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(
          err instanceof Error ? err.message : "Ocurrió un error inesperado.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setCargando(false);
        }
      }
    }
    cargar(); //esta llamada inicia la consulta al backend
    return () => controller.abort();
  }, []); //el array vacio significa que solo se ejecuta la primera vez que aparece la pantalla

  const busquedaNormalizada = busqueda.trim().toLocaleLowerCase("es");
  const empleadosFiltrados = empleados.filter((empleado) => {
    const datosDelEmpleado =
      `${empleado.nombre} ${empleado.apellido} ${empleado.cuil}`.toLocaleLowerCase(
        "es",
      );
    const coincideBusqueda = datosDelEmpleado.includes(busquedaNormalizada);
    const coincideEstado =
      estadoFiltro === "todos" ||
      (estadoFiltro === "activos" && empleado.activo) ||
      (estadoFiltro === "inactivos" && !empleado.activo);

    return coincideBusqueda && coincideEstado;
  });

  return (
    <main className="app-shell">
      <header className="page-header">
        <div>
          <h1>Empleados</h1>
          <p className="page-description">
            Consulta los datos y el estado de los empleados
          </p>
        </div>
        <div className="summary-card" aria-live="polite">
          <span className="summary-card__value">
            {cargando ? "—" : empleados.length}
          </span>
          <span className="summary-card__label">Empleados registrados</span>
        </div>
      </header>
      <section className="panel">
        {/*si se cumple esta condición, mostra este elemento*/}
        {cargando && <div className="feedback">Cargando empleados…</div>}
        {!cargando && error != null && (
          <div className="feedback feedback--error">{error}</div>
        )}
        {!cargando && !error && empleados.length === 0 && (
          <div className="feedback">No hay empleados registrados</div>
        )}
        {!cargando && !error && empleados.length > 0 && (
          <>
            <div className="toolbar">
              <div>
                <h2>Listado</h2>
                <p>
                  Mostrando {empleadosFiltrados.length} de {empleados.length}
                </p>
              </div>

              <div className="toolbar__actions">
                <label className="search-control">
                  Buscar
                  <input
                    type="search"
                    value={busqueda}
                    onChange={(event) => setBusqueda(event.target.value)}
                    placeholder="Nombre, apellido o CUIL"
                  />
                </label>

                <label className="filter-control">
                  Estado
                  <select
                    value={estadoFiltro}
                    onChange={(event) =>
                      setEstadoFiltro(event.target.value as EstadoFiltro)
                    }
                  >
                    <option value="todos">Todos</option>
                    <option value="activos">Activos</option>
                    <option value="inactivos">Inactivos</option>
                  </select>
                </label>
              </div>
            </div>

            {empleadosFiltrados.length === 0 ? (
              <div className="feedback">
                No se encontraron empleados con esos criterios.
              </div>
            ) : (
              <div className="empleados-tabla-contenedor">
                <table className="empleados-tabla">
                  <thead>
                    <tr>
                      <th>Nombre y apellido</th>
                      <th>CUIL</th>
                      <th>Puesto</th>
                      <th>Estado</th>
                    </tr>
                  </thead>

                  <tbody>
                    {empleadosFiltrados.map((empleado) => (
                      <tr key={empleado.id} className="empleado-row">
                        <td data-label="Empleado">
                          {empleado.nombre} {empleado.apellido}
                        </td>
                        <td data-label="CUIL">{empleado.cuil}</td>
                        <td data-label="Puesto">
                          {empleado.puesto ?? "Sin especificar"}
                        </td>
                        <td data-label="Estado">
                          <span
                            className={`estado-empleado ${
                              empleado.activo
                                ? "estado-empleado--activo"
                                : "estado-empleado--inactivo"
                            }`}
                          >
                            {empleado.activo ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
