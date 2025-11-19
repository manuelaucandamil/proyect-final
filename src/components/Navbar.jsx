// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // cargar usuario del localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("usuario");
      setUser(raw ? JSON.parse(raw) : null);
    } catch {
      setUser(null);
    }
  }, []);

  const toggle = () => setIsOpen((p) => !p);
  const close = () => setIsOpen(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">

        {/* LOGO */}
        <Link to="/" className="nav-logo" onClick={close}>
          <span className="logo-text">Flowy</span>
        </Link>

        {/* BOTÓN MÓVIL */}
        <button
          className="nav-toggle"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          onClick={toggle}
        >
          <div className={`hamburger ${isOpen ? "active" : ""}`} />
        </button>

        {/* MENÚ */}
        <div className={`nav-menu ${isOpen ? "open" : ""}`}>

          {/* LINKS SI ESTÁ LOGUEADO */}
          {user && (
            <div className="nav-links">
              <Link to="/sociedades" className="nav-link" onClick={close}>
                Sociedades
              </Link>

              <Link to="/ingresos" className="nav-link" onClick={close}>
                Ingresos
              </Link>

              <Link to="/distribucion" className="nav-link" onClick={close}>
                Distribuir ingresos
              </Link>

              <Link to="/historial-distribuciones" className="nav-link" onClick={close}>
                Historial
              </Link>
            </div>
          )}

          {/* ACCIONES (CTA) */}
          <div className="nav-actions">
            {!user ? (
              <>
                <Link to="/register" className="cta-button" onClick={close}>
                  Registrarse
                </Link>
                <Link to="/login" className="cta-button" onClick={close}>
                  Iniciar sesión
                </Link>
              </>
            ) : (
              <button className="cta-button logout" onClick={logout}>
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
