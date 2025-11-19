import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Ingresos() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ingresos, setIngresos] = useState([]);
  const [sociedades, setSociedades] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (id) {
      // Si hay ID, cargar ingresos de esa sociedad
      fetch(`/api/ingresos/lista/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then(setIngresos);
    } else {
      // Si no hay ID, cargar lista de sociedades
      fetch("/api/sociedades", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then(setSociedades);
    }
  }, [id, token]);

  if (!id) {
    // Mostrar lista de sociedades para seleccionar
    return (
      <div className="login-container">
        <Navbar />
        <main className="main-content">
          <div className="register-card fade-up">
            <h3>Seleccionar Sociedad para Ver Ingresos</h3>
            <ul className="list-group mt-3">
              {sociedades.map((s) => (
                <li key={s.id_sociedad} className="list-group-item d-flex justify-content-between align-items-center">
                  {s.nombre}
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate(`/ingresos/${s.id_sociedad}`)}
                  >
                    Ver Ingresos
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    );
  }

  // Mostrar ingresos de la sociedad seleccionada
  return (
    <div className="login-container">
      <Navbar />
      <main className="main-content">
        <div className="register-card fade-up">
          <h3>Ingresos de la Sociedad</h3>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate(`/ingresos/agregar/${id}`)}
          >
            Agregar Ingreso
          </button>
          <ul className="list-group mt-3">
            {ingresos.map((i) => (
              <li key={i.id_ingreso} className="list-group-item">
                <strong>${i.monto}</strong> — {i.descripcion}
                <br />
                <small className="text-muted">{i.fecha}</small>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
