import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  // 🔥 Detectar si hay usuario logueado
  const user = localStorage.getItem("usuario");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* LOGO */}
        <div className="nav-logo">
          <Link to="/" className="logo-text" onClick={closeMenu}>
            Flowy
          </Link>
        </div>

        {/* BOTÓN HAMBURGUESA */}
        <button
          className="nav-toggle"
          onClick={toggleMenu}
          aria-label="Abrir o cerrar menú"
          aria-expanded={isMenuOpen}
        >
          <span className={`hamburger-line ${isMenuOpen ? "active" : ""}`} />
          <span className={`hamburger-line ${isMenuOpen ? "active" : ""}`} />
          <span className={`hamburger-line ${isMenuOpen ? "active" : ""}`} />
        </button>

        {/* MENÚ */}
        <div className={`nav-menu ${isMenuOpen ? "active" : ""}`}>

          {/* 🔥 SOLO SI HAY SESIÓN → mostrar estos enlaces */}
          {user && (
            <div className="nav-links">
              <Link to="/sociedades" className="nav-link" onClick={closeMenu}>
                Sociedades
              </Link>

              <Link to="/ingresos" className="nav-link" onClick={closeMenu}>
                Ingresos
              </Link>

              <Link to="/distribucion" className="nav-link" onClick={closeMenu}>
                Distribución
              </Link>

              <Link to="/distribuir" className="nav-link" onClick={closeMenu}>
                Distribuir
              </Link>

              <Link
                to="/historial-distribuciones"
                className="nav-link"
                onClick={closeMenu}
              >
                Historial Distribuciones
              </Link>
            </div>
          )}

          <div className="nav-cta">
            {/* 🔥 SI NO hay sesión → mostrar Registrarse e Iniciar sesión */}
            {!user && (
              <>
                <Link to="/register" className="cta-button" onClick={closeMenu}>
                  Registrarse
                </Link>

                <Link to="/login" className="cta-button" onClick={closeMenu}>
                  Iniciar sesión
                </Link>
              </>
            )}

            {/* 🔥 SI hay sesión → mostrar Cerrar sesión */}
            {user && (
              <button className="cta-button" onClick={logout}>
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
