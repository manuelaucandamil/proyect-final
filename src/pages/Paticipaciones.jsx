// src/pages/Participaciones.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { client } from "../api/client";
import "../index.css";

export default function Participaciones() {
  const { id_sociedad } = useParams();
  const navigate = useNavigate();

  const [socios, setSocios] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoSocio, setNuevoSocio] = useState({ id_usuario: "", porcentaje: "" });
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(false);

  const mostrarMensaje = (texto, tipo = "danger") =>
    setMensaje({ texto, tipo });

  // cargar socios de la sociedad
  const cargarParticipaciones = async () => {
    try {
      const data = await client.get(`/api/participaciones/${id_sociedad}`);
      setSocios(data);
    } catch (err) {
      mostrarMensaje(err.message);
    }
  };

  // cargar todos los usuarios (para agregar socios)
  const cargarUsuarios = async () => {
    try {
      const data = await client.get("/api/auth/usuarios"); // ← si quieres, puedo crear este endpoint
      setUsuarios(data);
    } catch {
      // o puedes simplemente escribir manualmente el ID de usuario aquí
    }
  };

  useEffect(() => {
    cargarParticipaciones();
    // cargarUsuarios();  ← si luego agregas endpoint
  }, []);

  const agregarSocio = async (e) => {
    e.preventDefault();

    if (!nuevoSocio.id_usuario || !nuevoSocio.porcentaje) {
      mostrarMensaje("Debes llenar todos los datos");
      return;
    }

    const pct = Number(nuevoSocio.porcentaje);
    if (isNaN(pct) || pct <= 0 || pct > 100) {
      mostrarMensaje("El porcentaje debe ser entre 1 y 100");
      return;
    }

    try {
      setLoading(true);

      await client.post("/api/participaciones", {
        id_sociedad,
        id_usuario: nuevoSocio.id_usuario,
        porcentaje: pct
      });

      mostrarMensaje("Socio agregado correctamente", "success");

      setNuevoSocio({ id_usuario: "", porcentaje: "" });
      cargarParticipaciones();

    } catch (err) {
      mostrarMensaje(err.message);
    } finally {
      setLoading(false);
    }
  };

  const eliminarSocio = async (id_participacion) => {
    if (!confirm("¿Seguro que quieres eliminar este socio?")) return;

    try {
      await client.delete(`/api/participaciones/${id_participacion}`);
      cargarParticipaciones();
    } catch (err) {
      mostrarMensaje(err.message);
    }
  };

  const actualizarPorcentaje = async (id_participacion, porcentaje) => {
    if (!porcentaje || porcentaje <= 0 || porcentaje > 100) {
      mostrarMensaje("Porcentaje inválido");
      return;
    }

    try {
      await client.put(`/api/participaciones/${id_participacion}`, {
        porcentaje: Number(porcentaje)
      });

      cargarParticipaciones();
      mostrarMensaje("Porcentaje actualizado", "success");

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
              <h3>Socios de la Sociedad</h3>
              <button className="btn btn-sm btn-secondary mt-2"
                onClick={() => navigate("/sociedades")}
              >
                Volver
              </button>
            </div>

            <div className="card-body">

              {mensaje && (
                <div className={`alert alert-${mensaje.tipo}`}>
                  {mensaje.texto}
                </div>
              )}

              <h4 className="section-title">Lista de Socios</h4>

              {socios.length === 0 ? (
                <p className="text-muted">Aún no hay socios registrados.</p>
              ) : (
                <ul className="list-group mb-4">
                  {socios.map((s) => (
                    <li key={s.id_participacion}
                        className="list-group-item d-flex justify-content-between">
                      
                      <div>
                        <strong>{s.usuarios?.nombre}</strong>
                        <div className="small text-muted">{s.usuarios?.email}</div>
                      </div>

                      <div className="d-flex align-items-center gap-2">

                        {/* porcentaje editable */}
                        <input
                          type="number"
                          defaultValue={s.porcentaje}
                          className="form-control form-control-sm"
                          style={{ width: "80px" }}
                          onBlur={(e) =>
                            actualizarPorcentaje(
                              s.id_participacion,
                              e.target.value
                            )
                          }
                        />
                        %

                        <button
                          className="btnverSocios btn-sm btn-danger"
                          onClick={() => eliminarSocio(s.id_participacion)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <h4 className="section-title">Agregar Socio</h4>

              <form onSubmit={agregarSocio} className="register-form">

                <div className="form-group">
                  <label>ID Usuario</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Codigo usuario"
                    value={nuevoSocio.id_usuario}
                    onChange={(e) =>
                      setNuevoSocio({ ...nuevoSocio, id_usuario: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Porcentaje (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Ej: 25"
                    value={nuevoSocio.porcentaje}
                    onChange={(e) =>
                      setNuevoSocio({ ...nuevoSocio, porcentaje: e.target.value })
                    }
                  />
                </div>

                <button className="btn btn-primary w-100" disabled={loading}>
                  {loading ? "Agregando..." : "Agregar Socio"}
                </button>
              </form>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
