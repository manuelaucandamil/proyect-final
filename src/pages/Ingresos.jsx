import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";


export default function Ingresos() {
const { id } = useParams();
const [ingresos, setIngresos] = useState([]);
const token = localStorage.getItem("token");


useEffect(() => {
fetch(`/api/ingresos/lista/${id}`, {
headers: { Authorization: `Bearer ${token}` },
})
.then((r) => r.json())
.then(setIngresos);
}, []);


return (
<div className="login-container">
<Navbar />


<main className="main-content">
<div className="register-card fade-up">
<h3>Ingresos de la Sociedad</h3>


<button
className="btn btn-primary mt-3"
onClick={() => (window.location.href = `/ingresos/agregar/${id}`)}
>
Agregar Ingreso
</button>


<ul className="list-group mt-3">
{ingresos.map((i) => (
<li key={i.id_ingreso} className="list-group-item">
<strong>${i.monto}</strong> — {i.descripcion}
<br />
<small className="text-muted">{i.fecha}</small>
</li>
))}
</ul>
</div>
</main>
</div>
);
}