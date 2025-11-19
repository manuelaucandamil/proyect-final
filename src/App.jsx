// src/App.jsx
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Sociedades from "./pages/Sociedades";
import RegisterSociety from "./pages/RegistrarSociedad";

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
