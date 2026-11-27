import { Routes, Route } from "react-router";
import { Layout } from "./layouts/Layout";
import { InicioPage } from "./pages/InicioPage";
import { EntregasPage } from "./pages/EntregasPage";
import { EmpleadosPage } from "./pages/EmpleadosPage";
import { NuevoEmpleadoPage } from "./pages/NuevoEmpleadoPage";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<InicioPage />} />
        <Route path="entregas" element={<EntregasPage />} />
        <Route
          path="entregas/pendientes"
          element={<EntregasPage estadoFijo="PREPARADA" />}
        />
        <Route path="empleados" element={<EmpleadosPage />} />
        <Route path="empleados/nuevo" element={<NuevoEmpleadoPage />} />
      </Route>
    </Routes>
  );
}

export default App;
//routes selecciona que pantalla mostrar segun la URL
//Route asocia la direccion con el componente InicioPage
