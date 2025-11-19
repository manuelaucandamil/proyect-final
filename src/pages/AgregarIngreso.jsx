// src/pages/AgregarIngreso.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { client } from "../api/client";

export default function AgregarIngreso() {
  const { id_sociedad } = useParams();
  const navigate = useNavigate();

  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(false);

  const mostrarMensaje = (texto, tipo = "danger") =>
    setMensaje({ texto, tipo });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    const montoNumero = Number(monto);

    if (isNaN(montoNumero) || montoNumero <= 0) {
      mostrarMensaje("El monto debe ser un número mayor a 0");
      return;
    }

    try {
      setLoading(true);

      await client.post("/api/ingresos", {
        id_sociedad: Number(id_sociedad),
        monto: montoNumero,
        descripcion: descripcion.trim() || null,
      });

      mostrarMensaje("Ingreso registrado correctamente 🎉", "success");

      setTimeout(() => {
        navigate(`/ingresos/${id_sociedad}`);
      }, 800);

    } catch (err) {
      mostrarMensaje(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Navbar />

      <main className="main-content">
        <div className="register-container">
          <div className="register-card fade-up">

            <div className="card-header d-flex justify-content-between">
              <h3>Registrar Ingreso</h3>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => navigate(`/ingresos/${id_sociedad}`)}
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

              <form onSubmit={handleSubmit} className="register-form">

                {/* MONTO */}
                <div className="form-group">
                  <label className="form-label">Monto del ingreso ($)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    placeholder="Ej: 150000"
                    required
                    disabled={loading}
                  />
                </div>

                {/* DESCRIPCIÓN */}
                <div className="form-group">
                  <label className="form-label">Descripción (opcional)</label>
                  <textarea
                    className="form-control"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Ej: Pago de cliente ACME"
                    disabled={loading}
                  ></textarea>
                </div>

                <button className="btn btn-primary w-100" disabled={loading}>
                  {loading ? "Guardando..." : "Registrar Ingreso"}
                </button>

              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
