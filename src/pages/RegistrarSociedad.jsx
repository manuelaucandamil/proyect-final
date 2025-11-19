// src/pages/RegistrarSociedad.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { client } from "../api/client";

export default function RegistrarSociedad() {
  const [form, setForm] = useState({ nombre: "", descripcion: "" });
  const [codigo, setCodigo] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Genera el código único
  const generarCodigo = () => {
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numeros = Math.floor(Math.random() * 90000) + 10000;
    const prefijo =
      letras[Math.floor(Math.random() * letras.length)] +
      letras[Math.floor(Math.random() * letras.length)] +
      letras[Math.floor(Math.random() * letras.length)];

    setCodigo(`${prefijo}-${numeros}`);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((p) => ({ ...p, [id]: value }));
  };

  const mostrarMensaje = (texto, tipo = "danger") =>
    setMensaje({ texto, tipo });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre) {
      mostrarMensaje("Debes ingresar el nombre de la sociedad");
      return;
    }
    if (!codigo) {
      mostrarMensaje("Debes generar un código único");
      return;
    }

    try {
      setLoading(true);

      await client.post("/api/sociedades", {
        nombre: form.nombre,
        descripcion: form.descripcion,
        codigo
      });

      mostrarMensaje("Sociedad creada correctamente 🎉", "success");

      setTimeout(() => navigate("/sociedades"), 1000);

    } catch (error) {
      mostrarMensaje(error.message || "Error al crear la sociedad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container fade-in">
      <Navbar />

      <main className="main-content">
        <div className="register-container fade-up">
          <div className="register-card">
            <div className="card-header">
              <h3>Registrar Nueva Sociedad</h3>
              <p>Crea una sociedad para comenzar a gestionar socios y repartos</p>
            </div>

            <div className="card-body">
              {mensaje && (
                <div className={`alert alert-${mensaje.tipo}`}>
                  {mensaje.texto}
                </div>
              )}

              <form onSubmit={handleSubmit} className="register-form">
                <div className="form-group">
                  <label htmlFor="nombre" className="form-label">Nombre de la Sociedad</label>
                  <input
                    type="text"
                    id="nombre"
                    className="form-control"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Flowy S.A.S"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Código único</label>
                  <div className="codigo-box flex-between">
                    <input
                      type="text"
                      className="form-control"
                      value={codigo}
                      placeholder="Genera un código único"
                      disabled
                    />
                    <button
                      type="button"
                      className="btn btn-secondary ml-2"
                      onClick={generarCodigo}
                      disabled={loading}
                    >
                      Generar
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="descripcion" className="form-label">
                    Descripción (opcional)
                  </label>
                  <textarea
                    id="descripcion"
                    className="form-control"
                    value={form.descripcion}
                    onChange={handleChange}
                    placeholder="Descripción de la sociedad"
                  ></textarea>
                </div>

                <button className="btn btn-primary w-100" disabled={loading}>
                  {loading ? "Creando..." : "Crear Sociedad"}
                </button>
              </form>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
