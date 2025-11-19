// src/pages/Distribuir.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { client } from "../api/client";

export default function Distribuir() {
  const { id_ingreso } = useParams(); // ← debemos llamar la ruta así: /distribuir/:id_ingreso
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const mostrarMensaje = (texto, tipo = "danger") =>
    setMensaje({ texto, tipo });

  const handleDistribuir = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // manda SOLO id_ingreso
      await client.post("/api/distribuciones", {
        id_ingreso: Number(id_ingreso),
      });

      mostrarMensaje("Distribución realizada correctamente 🎉", "success");

      // Ir al historial de la sociedad
      setTimeout(() => {
        navigate(`/historial-distribuciones`);
      }, 600);

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
        <div className="register-card fade-up">

          <div className="card-header d-flex justify-content-between">
            <h3>Confirmar distribución</h3>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => navigate(-1)}
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

            <p>
              Se va a repartir el ingreso con ID <strong>{id_ingreso}</strong>.
              El monto se leerá automáticamente según el ingreso registrado.
            </p>

            <form onSubmit={handleDistribuir}>
              <button
                className="btn btn-primary w-100 mt-3"
                disabled={loading}
              >
                {loading ? "Procesando..." : "Repartir ingreso"}
              </button>
            </form>

          </div>

        </div>
      </main>
    </div>
  );
}
