import { useState, useRef, useEffect } from "react"; //useState("") le pide a React que recuerde un valor.
import { crearEmpleado } from "../services/empleados.service";
import "./NuevoEmpleadoPage.css";

const PUESTOS_DISPONIBLES = [
  "Vendedor/a",
  "Cajero/a",
  "Pastelero/a",
  "Sanguchero/a",
  "Cocinero/a",
  "Panadero/a",
  "Stock",
  "Administrativo/a",
  "Compras",
  "Repartidor/a",
  "Mantenimiento",
];

export function NuevoEmpleadoPage() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cuil, setCuil] = useState("");
  const [puestos, setPuestos] = useState<string[]>([]);
  const [error, setError] = useState("");
  //setNombre es la función que le pide a React que actualice ese valor y
  //vuelva a mostrar el componente con el dato nuevo.

  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const modalExito = useRef<HTMLDialogElement>(null);
  const desplegablePuestos = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const modal = modalExito.current;
    if (!mensajeExito || !modal) return;

    modal.showModal();

    const temporizador = window.setTimeout(() => {
      setMensajeExito("");
    }, 2500);

    return () => {
      window.clearTimeout(temporizador);
      modal.close();
    };
  }, [mensajeExito]);

  return (
    <main className="app-shell nuevo-empleado">
      <header className="page-header">
        <h1>Nuevo empleado</h1>
      </header>
      <form
        className="panel nuevo-empleado__formulario"
        onSubmit={async (event) => {
          event.preventDefault();
          if (guardando) return;
          setError("");
          setMensajeExito("");

          const cuilLimpio = cuil.trim();
          const formatoCuil = /^[0-9]{2}-[0-9]{8}-[0-9]$/;

          if (!formatoCuil.test(cuilLimpio)) {
            setError("Ingresá el CUIL con el formato 20-12345678-9.");
            return;
          }

          const nombreLimpio = nombre.trim();
          const apellidoLimpio = apellido.trim();

          if (!nombreLimpio || !apellidoLimpio) {
            setError("Ingresá el nombre y el apellido.");
            return;
          }

          const datosEmpleado = {
            nombre: nombreLimpio,
            apellido: apellidoLimpio,
            cuil: cuilLimpio,
            puesto: puestos.join(", ") || undefined,
          };

          setGuardando(true);

          try {
            await crearEmpleado(datosEmpleado);
            setNombre("");
            setApellido("");
            setCuil("");
            setPuestos([]);
            if (desplegablePuestos.current) {
              desplegablePuestos.current.open = false;
            }
            setMensajeExito("Empleado creado correctamente.");
          } catch (err) {
            setError(
              err instanceof Error
                ? err.message
                : "No se pudo guardar el empleado.",
            );
          } finally {
            //se ejecuta tanto si el guardado sale bien como si falla.
            //Así el botón vuelve a estar disponible en ambos casos.
            setGuardando(false);
          }
        }}
      >
        <div className="nuevo-empleado__campo">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            autoComplete="given-name"
            required
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
          />
          {/* value={nombre} le dice al campo qué texto mostrar. 
            onChange se ejecuta cada vez que escribís o borrás. 
            event.target.value contiene el texto completo del campo en ese momento, y setNombre lo guarda.*/}
        </div>
        <div className="nuevo-empleado__campo">
          <label htmlFor="apellido">Apellido</label>
          <input
            id="apellido"
            name="apellido"
            type="text"
            autoComplete="family-name"
            required
            value={apellido}
            onChange={(event) => setApellido(event.target.value)}
          />
        </div>
        <div className="nuevo-empleado__campo">
          <label htmlFor="cuil">CUIL</label>
          <input
            id="cuil"
            name="cuil"
            type="text"
            required
            placeholder="20-12345678-9"
            value={cuil}
            onChange={(event) => setCuil(event.target.value)}
          />
        </div>
        <fieldset className="nuevo-empleado__campo nuevo-empleado__puestos">
          <legend>
            Puestos <span className="nuevo-empleado__opcional">(opcional)</span>
          </legend>
          <details ref={desplegablePuestos}>
            <summary className="nuevo-empleado__puestos-resumen">
              {puestos.length > 0
                ? puestos.join(", ")
                : "Seleccioná uno o más puestos"}
            </summary>
            <div className="nuevo-empleado__puestos-opciones">
              {PUESTOS_DISPONIBLES.map((puesto) => (
                <label className="nuevo-empleado__puesto-opcion" key={puesto}>
                  <input
                    type="checkbox"
                    name="puestos"
                    value={puesto}
                    checked={puestos.includes(puesto)}
                    onChange={(event) => {
                      const marcado = event.currentTarget.checked;
                      setPuestos((actuales) =>
                        marcado
                          ? [...actuales, puesto]
                          : actuales.filter((actual) => actual !== puesto),
                      );
                    }}
                  />
                  {puesto}
                </label>
              ))}
            </div>
          </details>
        </fieldset>
        {error && (
          <p className="nuevo-empleado__error" role="alert">
            {error}
          </p>
        )}

        <div className="nuevo-empleado__acciones">
          <button
            className="button nuevo-empleado__guardar"
            type="submit"
            disabled={guardando}
          >
            {guardando ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </form>
      <dialog
        className="nuevo-empleado__modal"
        ref={modalExito}
        aria-labelledby="mensaje-empleado-creado"
        onCancel={(event) => {
          event.preventDefault();
          setMensajeExito("");
        }}
      >
        <span className="nuevo-empleado__icono-exito" aria-hidden="true">
          ✓
        </span>
        <p id="mensaje-empleado-creado">{mensajeExito}</p>
        <button
          className="button button--secondary"
          type="button"
          onClick={() => setMensajeExito("")}
        >
          Cerrar
        </button>
      </dialog>
    </main>
  );
}
