// src/pages/DistribucionDetalle.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { client } from "../api/client";

export default function DistribucionDetalle() {
  const { id_distribucion } = useParams();
  const navigate = useNavigate();

  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  const mostrarMensaje = (texto, tipo = "danger") =>
    setMensaje({ texto, tipo });

  useEffect(() => {
    cargarDetalle();
  }, [id_distribucion]);

  const cargarDetalle = async () => {
    try {
      setLoading(true);

      const data = await client.get(
        `/api/distribuciones/detalle/${id_distribucion}`
      );

      setDetalle(data);
    } catch (err) {
      mostrarMensaje(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="login-container">
        <Navbar />
        <main className="main-content">
          <div className="register-card fade-up">Cargando...</div>
        </main>
      </div>
    );
  }

  if (!detalle) {
    return (
      <div className="login-container">
        <Navbar />
        <main className="main-content">
          <div className="register-card fade-up">
            <p>No se encontró información de esta distribución.</p>
            <button
              className="btn btn-secondary mt-3"
              onClick={() => navigate("/historial-distribuciones")}
            >
              Volver
            </button>
          </div>
        </main>
      </div>
    );
  }

  const { ingreso, detalles } = detalle;

  return (
    <div className="login-container">
      <Navbar />

      <main className="main-content">
        <div className="register-card fade-up">

          <div className="d-flex justify-content-between">
            <h2>📄 Detalle de la Distribución #{id_distribucion}</h2>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => navigate(-1)}
            >
              Volver
            </button>
          </div>

          {mensaje && (
            <div className={`alert alert-${mensaje.tipo}`}>{mensaje.texto}</div>
          )}

          <div className="card p-3 mt-3 shadow-sm">
            <h5>Ingreso asociado</h5>
            <p><strong>Monto:</strong> ${Number(ingreso.monto).toLocaleString()}</p>
            <p><strong>Descripción:</strong> {ingreso.descripcion || "Sin descripción"}</p>
            <p><strong>Fecha:</strong> {new Date(ingreso.fecha).toLocaleString()}</p>
          </div>

          <div className="card p-3 mt-4 shadow-sm">
            <h5>Distribución entre socios</h5>

            <table className="table table-striped mt-3">
              <thead>
                <tr>
                  <th>Socio</th>
                  <th>Porcentaje</th>
                  <th>Valor recibido</th>
                </tr>
              </thead>

              <tbody>
                {detalles.map((d) => (
                  <tr key={d.id_detalle}>
                    <td>{d.usuario?.nombre || "Usuario"}</td>
                    <td>{d.porcentaje}%</td>
                    <td>${Number(d.valor_recibido).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  );
}
