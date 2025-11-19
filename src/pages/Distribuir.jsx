import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";


export default function Distribuir() {
const { id } = useParams();
const navigate = useNavigate();
const [monto, setMonto] = useState("");
const token = localStorage.getItem("token");


const handleDistribuir = async (e) => {
e.preventDefault();


await fetch("/api/distribuciones/hacer", {
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${token}`,
},
body: JSON.stringify({ id_sociedad: id, monto }),
});


navigate(`/distribuciones/${id}`);
};


return (
<div className="login-container">
<Navbar />
<main className="main-content">
<div className="register-card fade-up">
<h3>Distribuir Dinero</h3>


<form onSubmit={handleDistribuir}>
<div className="form-group">
<label>Monto total a distribuir</label>
<input
type="number"
className="form-control"
value={monto}
onChange={(e) => setMonto(e.target.value)}
required
/>
</div>


<button className="btn btn-primary w-100 mt-3">Distribuir</button>
</form>
</div>
</main>
</div>
);
}