import { useEffect, useState } from "react";
import { NavLink } from "react-router";

type SeccionId = "empleados" | "entregas" | "stock" | "catalogo" | "tareas";

type SeccionMenu = {
  id: SeccionId;
  nombre: string;
  icono: string;
  opciones: string[];
};

const rutasPorOpcion: Partial<Record<string, string>> = {
  "Todas las entregas": "/entregas",
  "Lista de empleados": "/empleados",
};

const secciones: SeccionMenu[] = [
  {
    id: "empleados",
    nombre: "Empleados",
    icono: "♙",
    opciones: ["Lista de empleados", "Nuevo empleado"],
  },
  {
    id: "entregas",
    nombre: "Entregas",
    icono: "▣",
    opciones: ["Nueva entrega", "Todas las entregas", "Pendientes de entrega"],
  },
  {
    id: "stock",
    nombre: "Stock",
    icono: "▦",
    opciones: ["Inventario", "Ingresar stock", "Movimientos", "Stock bajo"],
  },
  {
    id: "catalogo",
    nombre: "Catálogo",
    icono: "◫",
    opciones: ["Prendas", "Categorías"],
  },
  {
    id: "tareas",
    nombre: "Tareas",
    icono: "✓",
    opciones: ["Ver todas", "Pendientes"],
  },
];

export function MenuLateral() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [seccionAbierta, setSeccionAbierta] = useState<SeccionId | null>(null);
  const [opcionActiva, setOpcionActiva] = useState("Inicio");

  useEffect(() => {
    function cerrarConEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuAbierto(false);
      }
    }

    window.addEventListener("keydown", cerrarConEscape);
    return () => window.removeEventListener("keydown", cerrarConEscape);
  }, []);

  function seleccionarOpcion(opcion: string) {
    setOpcionActiva(opcion);

    if (window.matchMedia("(max-width: 700px)").matches) {
      setMenuAbierto(false);
    }
  }

  function alternarSeccion(seccion: SeccionId) {
    setSeccionAbierta((actual) => (actual === seccion ? null : seccion));
  }

  return (
    <>
      <button
        className="menu-button"
        type="button"
        aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
        aria-controls="menu-principal"
        aria-expanded={menuAbierto}
        onClick={() => setMenuAbierto((abierto) => !abierto)}
      >
        <span />
        <span />
        <span />
      </button>

      <button
        className={`menu-overlay ${menuAbierto ? "menu-overlay--visible" : ""}`}
        type="button"
        aria-label="Cerrar menú"
        tabIndex={menuAbierto ? 0 : -1}
        onClick={() => setMenuAbierto(false)}
      />

      <aside
        id="menu-principal"
        className={`side-menu ${menuAbierto ? "side-menu--open" : ""}`}
        aria-hidden={!menuAbierto}
      >
        <nav className="side-menu__nav" aria-label="Menú principal">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `menu-item menu-item--home ${isActive ? "menu-item--active" : ""}`
            }
            onClick={() => seleccionarOpcion("Inicio")}
          >
            <span className="menu-item__icon" aria-hidden="true">
              ⌂
            </span>
            <span>Inicio</span>
          </NavLink>

          <button
            className={`menu-item menu-item--quick ${opcionActiva === "Nueva entrega" ? "menu-item--quick-active" : ""}`}
            type="button"
            aria-current={opcionActiva === "Nueva entrega" ? "page" : undefined}
            onClick={() => seleccionarOpcion("Nueva entrega")}
          >
            <span className="menu-item__icon" aria-hidden="true">
              +
            </span>
            <span>Nueva entrega</span>
          </button>

          <div className="menu-sections">
            {secciones.map((seccion) => {
              const abierta = seccionAbierta === seccion.id;

              return (
                <section className="menu-section" key={seccion.id}>
                  <button
                    className="menu-section__toggle"
                    type="button"
                    aria-expanded={abierta}
                    aria-controls={`submenu-${seccion.id}`}
                    onClick={() => alternarSeccion(seccion.id)}
                  >
                    <span className="menu-item__icon" aria-hidden="true">
                      {seccion.icono}
                    </span>
                    <span>{seccion.nombre}</span>
                    <span
                      className={`menu-section__chevron ${abierta ? "menu-section__chevron--open" : ""}`}
                      aria-hidden="true"
                    >
                      ›
                    </span>
                  </button>

                  <div
                    id={`submenu-${seccion.id}`}
                    className={`menu-submenu ${abierta ? "menu-submenu--open" : ""}`}
                  >
                    {seccion.opciones.map((opcion) => {
                      const ruta = rutasPorOpcion[opcion];

                      if (ruta) {
                        return (
                          <NavLink
                            key={opcion}
                            to={ruta}
                            end
                            className={({ isActive }) =>
                              `menu-submenu__item ${
                                isActive ? "menu-submenu__item--active" : ""
                              }`
                            }
                            onClick={() => seleccionarOpcion(opcion)}
                          >
                            {opcion}
                          </NavLink>
                        );
                      }

                      return (
                        <button
                          className={`menu-submenu__item ${
                            opcionActiva === opcion
                              ? "menu-submenu__item--active"
                              : ""
                          }`}
                          type="button"
                          key={opcion}
                          aria-current={
                            opcionActiva === opcion ? "page" : undefined
                          }
                          onClick={() => seleccionarOpcion(opcion)}
                        >
                          {opcion}
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}
