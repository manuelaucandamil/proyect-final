// src/App.jsx
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Sociedades from "./pages/Sociedades";
import RegisterSociety from "./pages/RegistrarSociedad";
import Participaciones from "./pages/Paticipaciones";
import Ingresos from "./pages/Ingresos";
import AgregarIngreso from "./pages/AgregarIngreso";
import Distribuir from "./pages/Distribuir";
import DistribuirDetalle from "./pages/DistribucionesDetalle";
import HistorialDistrucion from "./pages/HistorialDistribuciones";
import Distribucion from "./pages/Distribucion";
import IngresoSociedad from "./pages/IngresoSociedad";
 
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Página principal */}
          <Route path="/" element={<Home />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/registrar-sociedad" element={<RegisterSociety />} />

          {/* Módulos */}
          <Route path="/sociedades" element={<Sociedades />} />
          <Route path="/participaciones/:id_sociedad" element={<Participaciones />} />
          <Route path="/ingresos" element={<Ingresos />} />
          <Route path="/agregar-ingreso/:id_sociedad" element={<AgregarIngreso />} />
          <Route path="/distribuir/:id_sociedad" element={<Distribuir />} />
          <Route path="/distribucion" element={<Distribucion />} />
          <Route path="/distribuciones-detalle/:id_sociedad" element={<DistribuirDetalle />} />
          <Route path="/historial-distribuciones" element={<HistorialDistrucion />} />
          <Route path="/ingreso-sociedad/:id_sociedad" element={<IngresoSociedad />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
