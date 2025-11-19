// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../index.css";
import Navbar from "../components/Navbar";
import { client } from "../api/client";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(false);

  const mostrarMensaje = (texto, tipo = "danger") => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      mostrarMensaje("Correo y contraseña son obligatorios");
      return;
    }

    try {
      setLoading(true);

      // 🔥 LOGIN CORRECTO
      const data = await client.post("/api/auth/login", {
        email,
        password
      });

      if (!data.token) {
        mostrarMensaje("Credenciales incorrectas");
        return;
      }

      // Guardar token
      localStorage.setItem("token", data.token);

      // Cargar usuario autenticado
      const info = await client.get("/api/auth/check");
      localStorage.setItem("usuario", JSON.stringify(info.usuario));

      mostrarMensaje("Inicio de sesión exitoso", "success");

      // Redirigir a sociedades
      setTimeout(() => navigate("/sociedades"), 400);

    } catch (err) {
      mostrarMensaje(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Navbar />

      <div className="hero-image">
        <img
          src="/src/assets/sociedad.jpg"
          alt="Sociedad colaborativa"
          className="img-fluid"
        />
      </div>

      <main className="main-content">
        <div className="content-wrapper">
          <div className="content-grid">

            <section className="info-section">
              <h2>¿Qué es Flowy?</h2>
              <p>
                Flowy es una aplicación web que automatiza la distribución de
                ingresos entre socios según porcentajes personalizados.
              </p>
              <ul className="features-list">
                <li>Evita errores humanos en los cálculos</li>
                <li>Distribuye automáticamente según porcentajes</li>
                <li>Registra el historial de transacciones</li>
              </ul>
            </section>

            <section className="login-section">
              <div className="login-form-container">
                <h3>Iniciar sesión</h3>

                {mensaje && (
                  <div className={`alert alert-${mensaje.tipo}`}>
                    {mensaje.texto}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                  <div className="form-group">
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ejemplo@correo.com"
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>

                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? "Entrando..." : "Entrar"}
                  </button>

                  <Link to="/register" className="btn-secondary">
                    Registrarse
                  </Link>
                </form>
              </div>
            </section>

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
