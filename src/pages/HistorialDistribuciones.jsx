// src/pages/HistorialDistribuciones.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { client } from "../api/client";

export default function HistorialDistribuciones() {
  const { id_sociedad } = useParams(); 
  const navigate = useNavigate();

  const [sociedades, setSociedades] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(true);

  const mostrarMensaje = (texto, tipo = "danger") =>
    setMensaje({ texto, tipo });

  // cargar sociedades o historial
  useEffect(() => {
    if (id_sociedad) {
      cargarHistorial(id_sociedad);
    } else {
      cargarSociedades();
    }
  }, [id_sociedad]);

  // ============================
  // 1. Cargar lista de sociedades
  // ============================
  const cargarSociedades = async () => {
    try {
      setLoading(true);
      const data = await client.get("/api/sociedades");
      setSociedades(data);
    } catch (err) {
      mostrarMensaje(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // 2. Cargar historial de una sociedad
  // ============================
  const cargarHistorial = async (id) => {
    try {
      setLoading(true);

      const data = await client.get(`/api/distribuciones/sociedad/${id}`);
      setHistorial(data);

    } catch (err) {
      mostrarMensaje(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // 3. Vista para elegir sociedad
  // ============================
  if (!id_sociedad) {
    return (
      <div className="login-container">
        <Navbar />

        <main className="main-content">
          <div className="register-card fade-up">

            <h3>Seleccionar sociedad</h3>
            {mensaje && (
              <div className={`alert alert-${mensaje.tipo}`}>{mensaje.texto}</div>
            )}

            {loading ? (
              <p>Cargando...</p>
            ) : (
              <ul className="list-group mt-3">
                {sociedades.map((s) => (
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
                      onClick={() =>
                        navigate(`/historial-distribuciones/${s.id_sociedad}`)
                      }
                    >
                      Ver historial
                    </button>
                  </li>
                ))}
              </ul>
            )}

          </div>
        </main>
      </div>
    );
  }

  // ============================
  // 4. Vista del historial
  // ============================
  return (
    <div className="login-container">
      <Navbar />

      <main className="main-content">
        <div className="register-card fade-up">

          <div className="d-flex justify-content-between">
            <h2>📊 Historial de distribuciones</h2>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => navigate("/historial-distribuciones")}
            >
              Cambiar sociedad
            </button>
          </div>

          {loading && <p>Cargando...</p>}

          {mensaje && (
            <div className={`alert alert-${mensaje.tipo}`}>
              {mensaje.texto}
            </div>
          )}

          {(!loading && historial.length === 0) && (
            <p className="mt-3 text-muted">No hay distribuciones aún.</p>
          )}

          {historial.map((item) => (
            <div key={item.id_distribucion} className="card mt-3">
              <div className="card-body">

                <h5>Distribución #{item.id_distribucion}</h5>

                <p>
                  <strong>Monto:</strong> ${item.ingresos?.monto}
                </p>

                <p>
                  <strong>Descripción:</strong>{" "}
                  {item.ingresos?.descripcion || "Sin descripción"}
                </p>

                <p>
                  <strong>Fecha:</strong>{" "}
                  {new Date(item.fecha).toLocaleString()}
                </p>

                <button
                  className="btn btn-primary btn-sm mt-2"
                  onClick={() =>
                    navigate(`/distribucion-detalle/${item.id_distribucion}`)
                  }
                >
                  Ver detalle
                </button>

              </div>
            </div>
          ))}

        </div>
      </main>
    </div>
  );
}
