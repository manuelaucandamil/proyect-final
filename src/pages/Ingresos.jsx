// src/pages/Ingresos.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { client } from "../api/client";

export default function Ingresos() {
  const { id_sociedad } = useParams();
  const navigate = useNavigate();
  const [ingresos, setIngresos] = useState([]);
  const [sociedades, setSociedades] = useState([]);
  const [ingresoSociedad, setIngresoSociedad] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  const mostrarMensaje = (texto, tipo = "danger") =>
    setMensaje({ texto, tipo });

  // cargar ingresos o sociedades
  useEffect(() => {
    cargar();
  }, [id_sociedad]);

  

  const cargar = async () => {
    try {
      setLoading(true);

      if (id_sociedad) {
        // cargar ingresos de la sociedad
        const data = await client.get(`/api/ingresos/${id_sociedad}`);
        setIngresos(data);
      } else {
        // cargar sociedades del usuario
        const data = await client.get("/api/sociedades");
        setSociedades(data);
      }
    } catch (err) {
      mostrarMensaje(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =======================
  // 1. Selección de sociedad
  // =======================
  if (!id_sociedad) {
    return (
      <div className="login-container">
        <Navbar />
        <main className="main-content">
          <div className="register-card fade-up">
            <h3>Seleccionar Sociedad</h3>
            {mensaje && <div className={`alert alert-${mensaje.tipo}`}>{mensaje.texto}</div>}

            {loading ? (
              <p>Cargando...</p>
            ) : (
              <ul className="list-group mt-3">
                {sociedades.length === 0 ? (
                  <p className="text-muted">No tienes sociedades creadas.</p>
                ) : (
                  sociedades.map((s) => (
                    <li
                      key={s.id_sociedad}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{s.nombre}</strong>
                        {s.descripcion && (
                          <div className="small text-muted">{s.descripcion}</div>
                        )}
                      </div>

                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/ingreso-sociedad/${s.id_sociedad}`)}
                      >
                        Ver ingresos
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/agregar-ingreso/${s.id_sociedad}`)}
                      >Agregar Ingreso</button>
                    </li>
                  ))
                )} 
              </ul>
            )}
          </div>
        </main>
      </div>
    );
  }

  // =======================
  // 2. Listar ingresos
  // =======================
  return (
    <div className="login-container">
      <Navbar />

      <main className="main-content">
        <div className="register-card fade-up">

          <div className="d-flex justify-content-between align-items-center">
            <h3>Ingresos registrados</h3>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/ingresos")}
            >
              Cambiar sociedad
            </button>
          </div>

          {mensaje && <div className={`alert alert-${mensaje.tipo}`}>{mensaje.texto}</div>}

          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate(`/ingresos/agregar/${id_sociedad}`)}
          >
            Registrar ingreso
          </button>

          {loading ? (
            <p className="mt-3">Cargando ingresos...</p>
          ) : ingresos.length === 0 ? (
            <p className="mt-3 text-muted">No hay ingresos registrados.</p>
          ) : (
            <ul className="list-group mt-4">
              {ingresos.map((i) => (
                <li key={i.id_ingreso} className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>${i.monto}</strong> — {i.descripcion || "Sin descripción"}
                      <div className="small text-muted">{new Date(i.fecha).toLocaleString()}</div>
                    </div>

                    {/* botón para repartir */}
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => navigate(`/distribuir/${i.id_ingreso}`)}
                    >
                      Repartir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
