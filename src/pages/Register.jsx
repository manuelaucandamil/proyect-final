import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../index.css";

export default function Register() {
  const navigate = useNavigate();

  const irARegistrarSociedad = () => {
    navigate("/registrar-sociedad");
  };

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    codigoSociedad: "",
    porcentajeSocio: "",
  });

  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(false);

  const mostrarMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 5000);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { nombre, email, password, codigoSociedad, porcentajeSocio } =
      formData;

    // Validación básica en front
    if (!nombre || !email || !password || !codigoSociedad || !porcentajeSocio) {  
      mostrarMensaje("Todos los campos son obligatorios", "danger");
      setLoading(false);
      return;
    }

    const porcentajeNumero = parseFloat(porcentajeSocio);

    if (isNaN(porcentajeNumero) || porcentajeNumero <= 0) {
      mostrarMensaje("El porcentaje debe ser un número mayor a 0", "danger");
      setLoading(false);
      return;
    }

    if (porcentajeNumero > 100) {
      mostrarMensaje("El porcentaje no puede ser mayor a 100%", "danger");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          email,
          password,
          codigoSociedad,
          porcentaje: porcentajeNumero,
        }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        // Mostrar mensaje
        mostrarMensaje("¡Usuario registrado correctamente!", "success");

        // Guardar token y usuario
        localStorage.setItem("token", data.token);
        if (data.usuario) {
          localStorage.setItem("usuario", JSON.stringify(data.usuario));
        }

        // Limpiar formulario (opcional)
        setFormData({
          nombre: "",
          email: "",
          password: "",
          codigoSociedad: "",
          porcentajeSocio: "",
        });

        // Redirigir al dashboard de sociedades
        setTimeout(() => {
          navigate("/sociedades");
        }, 800);
      } else {
        mostrarMensaje(
          data.mensaje || "Error al registrar usuario",
          "danger"
        );
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
      <div className="background-image"></div>
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
                  <label htmlFor="nombre" className="form-label">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ingresa tu nombre completo"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ejemplo@correo.com"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>

                {/* NUEVOS CAMPOS SOCIEDAD */}
                <div className="form-group">
                  <label htmlFor="codigoSociedad" className="form-label">
                    Código de la sociedad
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="codigoSociedad"
                    value={formData.codigoSociedad}
                    onChange={handleChange}
                    placeholder="Ej: FLOWY-12345"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="porcentajeSocio" className="form-label">
                    Porcentaje de participación (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    id="porcentajeSocio"
                    value={formData.porcentajeSocio}
                    onChange={handleChange}
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
                  {loading ? "Registrando..." : "Registrar"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary w-100 mt-3"
                  onClick={irARegistrarSociedad}
                >
                  Registrar Nueva Sociedad
                </button>
              </form>
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
