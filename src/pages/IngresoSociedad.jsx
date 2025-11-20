// src/pages/AgregarIngreso.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { client } from "../api/client";

export default function IngresoSociedad() {
  const { id_sociedad } = useParams();
  const [ingresoSociedad, setIngresoSociedad] = useState([]);
  const navigate = useNavigate();


 useEffect(() => {
    cargarIngresoSociedad();
  }, [id_sociedad]);

  const cargarIngresoSociedad = async () => {
    if (!id_sociedad) return;
    try {
      const data = await client.get(`/api/ingresos/ingreso/${id_sociedad}`);
      console.log(data);
      setIngresoSociedad(data);
    } catch (err) {
      mostrarMensaje(err.message);
    }
  };

  return (
    <div className="login-container">
      <Navbar />

      <main className="main-content">
        <div className="register-container">
          <div className="register-card fade-up">

            <div className="card-header d-flex justify-content-between">
              <h3>Lista ingresos </h3>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => navigate(`/ingresos`)}
              >
                Volver
              </button>
            </div>

            <div className="card-body">

             <ul className="list-group mt-3">
                {ingresoSociedad.length === 0 ? (
                  <p className="text-muted">No tienes sociedades creadas.</p>
                ) : (
                  ingresoSociedad.map((s) => (
                    <li
                      key={s.id_monto}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{s.monto}</strong>
                        {s.descripcion && (
                          <div className="small text-muted">{s.descripcion}</div>
                        )}
                      </div>
                    </li>
                  ))
                )} 
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
