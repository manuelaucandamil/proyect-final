import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function HistorialDistribuciones() {
  const { idSociedad } = useParams();

  const [historial, setHistorial] = useState([]);

  async function cargar() {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:3000/distribuciones/${idSociedad}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    setHistorial(data);
  }

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="container mt-4">
        <h2>📊 Historial de Distribuciones</h2>

        {historial.length === 0 && <p>No hay distribuciones todavía.</p>}

        {historial.map((h) => (
          <div key={h.id_distribucion} className="card mt-3">
            <div className="card-body">
              <h5>Distribución #{h.id_distribucion}</h5>

              <p>
                <strong>Monto:</strong> ${h.ingresos.monto}
              </p>
              <p>
                <strong>Descripción:</strong> {h.ingresos.descripcion}
              </p>
              <p>
                <strong>Fecha:</strong> {new Date(h.fecha).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
