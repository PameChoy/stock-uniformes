import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './index.css';
import App from './App.tsx';
//<BrowserRouter> permite que cualquier componente dentro de App pueda:
//Consultar la URL actual. Cambiar de pantalla. Navegar sin recargar toda la aplicación.
//Utilizar Routes, Route, Link y NavLink.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
