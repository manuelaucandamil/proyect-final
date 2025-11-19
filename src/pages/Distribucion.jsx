// src/pages/Distribucion.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { client } from "../api/client";

export default function Distribucion() {
  const navigate = useNavigate();

  const [sociedades, setSociedades] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const [idSociedad, setIdSociedad] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(false);

  const mostrarMensaje = (texto, tipo = "danger") =>
    setMensaje({ texto, tipo });

  // 1️⃣ Cargar sociedades del usuario
  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await client.get("/api/sociedades");
        setSociedades(data);
      } catch (err) {
        mostrarMensaje(err.message);
      }
    };
    cargar();
  }, []);

  // 2️⃣ Cuando el usuario selecciona una sociedad → cargar ingresos
  const cargarIngresos = async (idSoc) => {
    setIdSociedad(idSoc);
    setIngresos([]);

    try {
      setLoading(true);

      const data = await client.get(`/api/ingresos/${idSoc}`);
      setIngresos(data);

    } catch (err) {
      mostrarMensaje(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3️⃣ Repartir un ingreso
  const repartirIngreso = async (id_ingreso) => {
    try {
      setLoading(true);

      await client.post("/api/distribuciones", {
        id_ingreso: Number(id_ingreso)
      });

      mostrarMensaje("Distribución realizada correctamente 🎉", "success");

      // recargar ingresos para ver cambios en el historial
      cargarIngresos(idSociedad);

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

          <h2 className="mb-3">Distribuir ingresos</h2>

          {mensaje && (
            <div className={`alert alert-${mensaje.tipo}`}>{mensaje.texto}</div>
          )}

          {/* Seleccionar sociedad */}
          <div className="mb-4">
            <label className="form-label fw-bold">Selecciona una sociedad</label>
            <select
              className="form-select"
              value={idSociedad}
              onChange={(e) => cargarIngresos(e.target.value)}
            >
              <option value="">-- Selecciona --</option>
              {sociedades.map((s) => (
                <option key={s.id_sociedad} value={s.id_sociedad}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Ingresos de la sociedad */}
          {idSociedad && (
            <div className="card p-4 mt-3 shadow-sm">
              <h4>Ingresos registrados</h4>

              {loading ? (
                <p>Cargando ingresos...</p>
              ) : ingresos.length === 0 ? (
                <p className="text-muted mt-2">Aún no hay ingresos registrados.</p>
              ) : (
                <ul className="list-group mt-3">
                  {ingresos.map((i) => (
                    <li
                      key={i.id_ingreso}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>${i.monto}</strong> — {i.descripcion}
                        <br />
                        <small className="text-muted">
                          {new Date(i.fecha).toLocaleString()}
                        </small>
                      </div>

                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => repartirIngreso(i.id_ingreso)}
                      >
                        Repartir
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
