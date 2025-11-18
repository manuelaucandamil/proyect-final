// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import Navbar from "../components/Navbar";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(false);

  const mostrarMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      mostrarMensaje("Correo y contraseña son obligatorios", "danger");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.login && data.token) {
        // Guardar token y usuario
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));

        mostrarMensaje("Inicio de sesión exitoso", "success");

        // Redirigir a dashboard de sociedades
        setTimeout(() => {
          navigate("/sociedades");
        }, 500);
      } else {
        mostrarMensaje(data.mensaje || "Correo o contraseña incorrectos", "danger");
      }
    } catch (error) {
      console.error(error);
      mostrarMensaje("Error de conexión al servidor", "danger");
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
                dinero entre socios según porcentajes personalizados.
              </p>
              <ul className="features-list">
                <li>Evita errores humanos en cálculos financieros</li>
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
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Entrando..." : "Entrar"}
                  </button>

                  <a href="/register" className="btn-secondary">
                    Registrarse
                  </a>
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
