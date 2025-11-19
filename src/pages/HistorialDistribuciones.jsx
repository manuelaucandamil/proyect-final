import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function HistorialDistribuciones() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [historial, setHistorial] = useState([]);
  const [sociedades, setSociedades] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (id) {
      // Si hay ID, cargar historial de esa sociedad
      cargarHistorial(id);
    } else {
      // Si no hay ID, cargar lista de sociedades
      fetch("/api/sociedades", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then(setSociedades);
    }
  }, [id, token]);

  async function cargarHistorial(idSociedad) {
    const res = await fetch(`/api/distribuciones/${idSociedad}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setHistorial(data);
  }

  if (!id) {
    // Mostrar lista de sociedades para seleccionar
    return (
      <div className="login-container">
        <Navbar />
        <main className="main-content">
          <div className="register-card fade-up">
            <h3>Seleccionar Sociedad para Ver Historial</h3>
            <ul className="list-group mt-3">
              {sociedades.map((s) => (
                <li key={s.id_sociedad} className="list-group-item d-flex justify-content-between align-items-center">
                  {s.nombre}
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate(`/historial-distribuciones/${s.id_sociedad}`)}
                  >
                    Ver Historial
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    );
  }

  // Mostrar historial de la sociedad seleccionada
  return (
    <div className="login-container">
      <Navbar />
      <main className="main-content">
        <div className="register-card fade-up">
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
      </main>
    </div>
  );
}
