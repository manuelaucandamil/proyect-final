// src/pages/Sociedades.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../index.css";
import Navbar from "../components/Navbar";
import { client } from "../api/client";

export default function Sociedades() {
  const navigate = useNavigate();
  const [sociedades, setSociedades] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(false);

  const mostrarMensaje = (texto, tipo = "danger") => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 4000);
  };

  useEffect(() => {
    cargarSociedades();
  }, []);

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

  const eliminarSociedad = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta sociedad?")) return;

    try {
      await client.delete(`/api/sociedades/${id}`);
      mostrarMensaje("Sociedad eliminada", "success");
      cargarSociedades();
    } catch (err) {
      mostrarMensaje(err.message);
    }
  };

  return (
    <div className="login-container">
      <Navbar />

      <main className="main-content">
        <div className="register-container">
          <div className="register-card">

            <div className="card-header">
              <h3>Mis Sociedades</h3>
              <p>Las sociedades que has creado en Flowy.</p>
            </div>

            <div className="card-body">

              {mensaje && (
                <div className={`alert alert-${mensaje.tipo}`}>
                  {mensaje.texto}
                </div>
              )}

              {loading && <p>Cargando...</p>}

              <div className="sociedades-grid">
                <section className="sociedades-col">
                  <h4 className="section-title">Listado</h4>

                  {sociedades.length === 0 ? (
                    <p className="text-muted">No tienes sociedades creadas.</p>
                  ) : (
                    <ul className="list-group">
                      {sociedades.map((soc) => (
                        <li key={soc.id_sociedad}
                            className="list-group-item d-flex justify-content-between">
                          <div>
                            <strong>{soc.nombre}</strong>
                            {soc.descripcion && (
                              <div className="small text-muted">
                                {soc.descripcion}
                              </div>
                            )}
                          </div>

                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-info"
                              onClick={() => navigate(`/participaciones/${soc.id_sociedad}`)}
                            >
                              Ver socios
                            </button>

                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => eliminarSociedad(soc.id_sociedad)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section className="socios-col">
                  <h4 className="section-title">Crear nueva sociedad</h4>

                  <Link to="/registrar-sociedad" className="btn btn-primary w-100">
                    Registrar Sociedad
                  </Link>
                </section>
              </div>

            </div>
          </div>
        </div>
      </main>

      <footer className="login-footer">
        <p>&copy; 2025 Flowy | Manuela Urrea Candamil</p>
        <div className="footer-links">
          <a href="https://www.instagram.com">Instagram</a>
          <a href="https://www.whatsapp.com">Whatsapp</a>
        </div>
      </footer>
    </div>
  );
}
