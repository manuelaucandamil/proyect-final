// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { client } from "../api/client";
import "../index.css";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const mostrarMensaje = (texto, tipo = "danger") => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 5000);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nombre, email, password } = formData;

    if (!nombre || !email || !password) {
      mostrarMensaje("Todos los campos son obligatorios");
      return;
    }

    try {
      setLoading(true);

      await client.post("/api/auth/register", {
        nombre,
        email,
        password
      });

      mostrarMensaje("Usuario registrado correctamente", "success");

      // ir al login luego de 1 segundo
      setTimeout(() => navigate("/login"), 1000);
      
    } catch (error) {
      console.error(error);
      mostrarMensaje(error.message || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Navbar />

      <main className="main-content">
        <div className="register-container">
          <div className="register-card">
            <div className="card-header">
              <h3>Crear Cuenta en Flowy</h3>
              <p>Comienza a gestionar tus sociedades hoy mismo</p>
            </div>

            <div className="card-body">
              {mensaje && (
                <div className={`alert alert-${mensaje.tipo}`}>
                  {mensaje.texto}
                </div>
              )}

              <form onSubmit={handleSubmit} className="register-form">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre completo</label>
                  <input
                    type="text"
                    id="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ingresa tu nombre completo"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Correo electrónico</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
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
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    disabled={loading}
                    minLength={6}
                    required
                  />
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary w-100">
                  {loading ? "Registrando..." : "Registrar"}
                </button>

                <Link to="/login" className="btn btn-secondary w-100 mt-3">
                  Iniciar sesión
                </Link>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
