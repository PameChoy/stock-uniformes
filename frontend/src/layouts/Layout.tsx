//Layout el componente que compartirá el menú y la estructura general entre las pantallas
import { Outlet } from "react-router";
//Outlet es el espacio donde React Router muestra la pantalla correspondiente a la ruta hija
import { MenuLateral } from "../components/MenuLateral";
import "./Layout.css";

export function Layout() {
  return (
    <div className="app-layout">
      <MenuLateral />
      <Outlet />
    </div>
  );
}
