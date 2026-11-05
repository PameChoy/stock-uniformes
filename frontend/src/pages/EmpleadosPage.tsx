//.tsx permite escribir JSX, la sintaxis que usamos en React
// para describir la interfaz: títulos, botones, tablas y componentes.
import { useState, useEffect } from "react";
import { listarEmpleados } from "../services/empleados.service";
import type { Empleado } from "../types/empleado";

export function EmpleadosPage() {
  //definimos los estados de la pantalla, que son variables que cambian con el tiempo y
  // que hacen que la pantalla se vuelva a renderizar cuando cambian
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <main className="app-shell">
      <header className="page-header">
        <div>
          <h1>Empleados</h1>
          <p className="page-description">
            Consulta los datos y el estado de los empleados
          </p>
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
          <div className="feedback">
            Empleados registrados: {empleados.length}
          </div>
        )}
      </section>
    </main>
  );
}
