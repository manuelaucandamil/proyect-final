import { useState } from "react";
import "../index.css";
import Navbar from "../components/Navbar"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState(null);

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
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.login) {
        window.location.href = "bienvenida.html";
      } else {
        mostrarMensaje("Correo o contraseña incorrectos", "danger");
      }
    } catch (error) {
      mostrarMensaje("Error de conexión al servidor", "danger");
    }
  };

  return (
    <div className="login-container">
      {/* NAVBAR IMPORTADO */}
      <Navbar />

      {/* IMAGEN PRINCIPAL ARRIBA DE TODO */}
      <div className="hero-image">
        <img
          src="/src/assets/sociedad.jpg"
          alt="Sociedad colaborativa"
          className="img-fluid"
        />
      </div>

      {/* CONTENIDO PRINCIPAL - DISEÑO HORIZONTAL */}
      <main className="main-content">
        <div className="content-wrapper">
          <div className="content-grid">
            {/* SECCIÓN INFORMATIVA AL LADO DEL LOGIN */}
            <section className="info-section">
              <h2>¿Qué es Flowy?</h2>
              <p>
                Flowy es una aplicación web que automatiza la distribución de dinero entre socios según porcentajes
                personalizados. Precisión, rapidez y transparencia para grupos que comparten ingresos.
              </p>
              <ul className="features-list">
                <li>Evita errores humanos en cálculos financieros</li>
                <li>Distribuye automáticamente según porcentajes</li>
                <li>Registra el historial de transacciones</li>
              </ul>
            </section>

            {/* FORMULARIO DE LOGIN */}
            <section className="login-section">
              <div className="login-form-container">
                <h3>Iniciar sesión</h3>
                
                {/* MENSAJES DE ALERTA */}
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
                    />
                  </div>

                  <button type="submit" className="btn-primary">
                    Entrar
                  </button>
                  
                  <a href="./Register" className="btn-secondary">
                    Registrarse
                  </a>
                </form>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* FOOTER */}
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