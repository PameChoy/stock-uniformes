import { useEffect, useState } from 'react';
import { API_URL } from './config/api';
import './App.css';

function App() {
  const [mensaje, setMensaje] = useState('Conectando con el backend...');

  useEffect(() => {
    async function cargarEntregas() {
      try {
        const respuesta = await fetch(`${API_URL}/entregas`);

        if (!respuesta.ok) {
          throw new Error(`El backend respondió ${respuesta.status}`);
        }

        const entregas: unknown = await respuesta.json();

        if (!Array.isArray(entregas)) {
          throw new Error('El backend no devolvió una lista de entregas.');
        }

        setMensaje(
          `Conexión exitosa. Entregas encontradas: ${entregas.length}`,
        );
        console.log('Entregas:', entregas);
      } catch (error) {
        console.error('Error al consultar las entregas:', error);
        setMensaje('No se pudo conectar con el backend.');
      }
    }

    cargarEntregas();
  }, []);

  return (
    <main>
      <h1>Sistema de stock de uniformes</h1>
      <p>{mensaje}</p>
    </main>
  );
}

export default App;
