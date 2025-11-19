import { useState, useEffect } from "react";

export default function Distribucion() {
  const [sociedades, setSociedades] = useState([]);
  const [socios, setSocios] = useState([]);
  const [sociedadSeleccionada, setSociedadSeleccionada] = useState("");
  const [monto, setMonto] = useState("");
  const [resultados, setResultados] = useState([]);

  // 1️⃣ Cargar sociedades
  useEffect(() => {
    fetch("http://localhost:3000/api/sociedades")
      .then((res) => res.json())
      .then((data) => setSociedades(data))
      .catch(() => alert("Error cargando sociedades"));
  }, []);

  // 2️⃣ Al seleccionar sociedad → traer sus socios
  const cargarSocios = async (idSociedad) => {
    setSociedadSeleccionada(idSociedad);

    const res = await fetch(`http://localhost:3000/api/socios/${idSociedad}`);
    const data = await res.json();

    setSocios(data);
    setResultados([]);
    setMonto("");
  };

  // 3️⃣ Calcular reparto
  const calcularDistribucion = () => {
    if (!monto || monto <= 0) return alert("Ingresa un monto válido");

    const calculos = socios.map((s) => ({
      ...s,
      valor_recibido: (monto * (s.porcentaje / 100)).toFixed(2),
    }));

    setResultados(calculos);
  };

  // 4️⃣ Guardar distribución en backend
  const guardarDistribucion = async () => {
    const payload = {
      id_sociedad: sociedadSeleccionada,
      monto_total: monto,
      detalles: resultados.map((r) => ({
        id_usuario: r.id_usuario,
        porcentaje: r.porcentaje,
        valor_recibido: r.valor_recibido,
      })),
    };

    const res = await fetch("http://localhost:3000/api/distribuciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Distribución registrada con éxito");
      setMonto("");
      setSocios([]);
      setResultados([]);
      setSociedadSeleccionada("");
    } else {
      alert("Error al guardar distribución");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-primary">Distribución de Dinero entre Socios</h2>

      {/* Seleccionar sociedad */}
      <div className="card p-4 shadow-sm">
        <label className="form-label fw-bold">Selecciona una Sociedad</label>
        <select
          className="form-select"
          value={sociedadSeleccionada}
          onChange={(e) => cargarSocios(e.target.value)}
        >
          <option value="">-- Selecciona --</option>
          {sociedades.map((s) => (
            <option key={s.id_sociedad} value={s.id_sociedad}>
              {s.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Mostrar socios */}
      {socios.length > 0 && (
        <div className="card p-4 mt-4 shadow-sm">
          <h5 className="mb-3">Socios de la Sociedad</h5>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Porcentaje (%)</th>
              </tr>
            </thead>
            <tbody>
              {socios.map((s) => (
                <tr key={s.id_usuario}>
                  <td>{s.nombre}</td>
                  <td>{s.email}</td>
                  <td>{s.porcentaje}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Monto a distribuir */}
          <div className="mt-3">
            <label className="form-label fw-bold">Monto total a distribuir</label>
            <input
              type="number"
              className="form-control"
              placeholder="Ejemplo: 1500000"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
            />
          </div>

          <button onClick={calcularDistribucion} className="btn btn-primary mt-3">
            Calcular Distribución
          </button>
        </div>
      )}

      {/* Resultados */}
      {resultados.length > 0 && (
        <div className="card p-4 mt-4 shadow">
          <h5>Resultados del Reparto</h5>
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th>Socio</th>
                <th>Porcentaje</th>
                <th>Valor Recibido</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((r) => (
                <tr key={r.id_usuario}>
                  <td>{r.nombre}</td>
                  <td>{r.porcentaje}%</td>
                  <td>${Number(r.valor_recibido).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="btn btn-success mt-3" onClick={guardarDistribucion}>
            Guardar Distribución
          </button>
        </div>
      )}
    </div>
  );
}
