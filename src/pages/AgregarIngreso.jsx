import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";


export default function AgregarIngreso() {
const { id } = useParams();
const navigate = useNavigate();
const [monto, setMonto] = useState("");
const [descripcion, setDescripcion] = useState("");
const token = localStorage.getItem("token");


const handleSubmit = async (e) => {
e.preventDefault();


await fetch("/api/ingresos/agregar", {
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${token}`,
},
body: JSON.stringify({ id_sociedad: id, monto, descripcion }),
});


navigate(`/ingresos/${id}`);
};


return (
<div className="login-container">
<Navbar />
<main className="main-content">
<div className="register-card fade-up">
<h3>Agregar Ingreso</h3>


<form onSubmit={handleSubmit}>
<div className="form-group">
<label>Monto</label>
<input
type="number"
className="form-control"
value={monto}
onChange={(e) => setMonto(e.target.value)}
required
/>
</div>


<div className="form-group">
<label>Descripción</label>
<textarea
className="form-control"
value={descripcion}
onChange={(e) => setDescripcion(e.target.value)}
/>
</div>


<button className="btn btn-primary w-100">Guardar</button>
</form>
</div>
</main>
</div>
);
}