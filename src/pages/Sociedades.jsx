// src/pages/Sociedades.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import Navbar from "../components/Navbar";

export default function Sociedades() {
  const navigate = useNavigate();

  const [misSociedades, setMisSociedades] = useState([]);
  const [codigoSociedad, setCodigoSociedad] = useState("");
  const [porcentajeSocio, setPorcentajeSocio] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(false);

  const mostrarMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 4000);
  };

  // Cargar sociedades del usuario al entrar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Si no hay token, mandar al login
      navigate("/login");
      return;
    }

    cargarMisSociedades(token);
  }, [navigate]);

  const cargarMisSociedades = async (token) => {
    try {
      setLoading(true);
      const res = await fetch("/api/mis-sociedades", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        if (res.status === 401) {
          // Token inválido o expirado, redirigir a login
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
          navigate("/login");
          return;
        }
        mostrarMensaje(
          data.mensaje || "Error al obtener tus sociedades",
          "danger"
        );
        return;
      }

      setMisSociedades(data);
    } catch (error) {
      console.error(error);
      mostrarMensaje("Error de conexión al servidor", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleUnirmeSociedad = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!codigoSociedad || !porcentajeSocio) {
      mostrarMensaje(
        "Debes ingresar el código de la sociedad y el porcentaje",
        "danger"
      );
      return;
    }

    const porcentajeNumero = parseFloat(porcentajeSocio);

    if (isNaN(porcentajeNumero) || porcentajeNumero <= 0) {
      mostrarMensaje("El porcentaje debe ser mayor a 0", "danger");
      return;
    }

    if (porcentajeNumero > 100) {
      mostrarMensaje("El porcentaje no puede ser mayor a 100%", "danger");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/unirme-sociedad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          codigoSociedad,
          porcentaje: porcentajeNumero,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        mostrarMensaje(
          data.mensaje || "No fue posible unirse a la sociedad",
          "danger"
        );
        return;
      }

      mostrarMensaje("¡Te uniste a la sociedad correctamente!", "success");

      setCodigoSociedad("");
      setPorcentajeSocio("");

      await cargarMisSociedades(token);
    } catch (error) {
      console.error(error);
      mostrarMensaje("Error de conexión al servidor", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="background-image"></div>
      <Navbar />

      <main className="main-content">
        <div className="register-container">
          <div className="register-card">
            <div className="card-header">
              <h3>Mis Sociedades</h3>
              <p>
                Aquí puedes ver las sociedades a las que perteneces y unirte a
                nuevas usando su código.
              </p>
            </div>

            <div className="card-body">
              {mensaje && (
                <div className={`alert alert-${mensaje.tipo}`}>
                  {mensaje.texto}
                </div>
              )}

              {loading && (
                <div className="text-center mb-3">
                  <small>Cargando...</small>
                </div>
              )}

              <div className="sociedades-grid">
                {/* Columna: Mis sociedades */}
                <section className="sociedades-col">
                  <h4 className="section-title">Sociedades a las que perteneces</h4>

                  {misSociedades.length === 0 ? (
                    <p className="text-muted">
                      Aún no perteneces a ninguna sociedad. Únete usando un
                      código.
                    </p>
                  ) : (
                    <ul className="list-group">
                      {misSociedades.map((soc) => (
                        <li
                          key={soc.id_sociedad}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <strong>{soc.nombre}</strong>
                            {soc.descripcion && (
                              <div className="small text-muted">
                                {soc.descripcion}
                              </div>
                            )}
                          </div>
                          <span className="badge bg-primary rounded-pill">
                            {soc.porcentaje}% mío
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                {/* Columna: Unirme a otra sociedad */}
                <section className="socios-col">
                  <h4 className="section-title">Unirme a otra sociedad</h4>
                  <p className="text-muted small mb-2">
                    Ingresa el código de la sociedad y el porcentaje que te
                    corresponde. El sistema validará que la suma total no
                    supere el 100%.
                  </p>

                  <form
                    onSubmit={handleUnirmeSociedad}
                    className="register-form"
                  >
                    <div className="form-group">
                      <label
                        htmlFor="codigoSociedad"
                        className="form-label"
                      >
                        Código de la sociedad
                      </label>
                      <input
                        type="text"
                        id="codigoSociedad"
                        className="form-control"
                        value={codigoSociedad}
                        onChange={(e) => setCodigoSociedad(e.target.value)}
                        placeholder="Ej: FLOWY-12345"
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label
                        htmlFor="porcentajeSocio"
                        className="form-label"
                      >
                        Porcentaje de participación (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        id="porcentajeSocio"
                        className="form-control"
                        value={porcentajeSocio}
                        onChange={(e) => setPorcentajeSocio(e.target.value)}
                        placeholder="Ej: 25"
                        required
                        disabled={loading}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={loading}
                    >
                      {loading ? "Enviando..." : "Unirme a la sociedad"}
                    </button>
                  </form>
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
