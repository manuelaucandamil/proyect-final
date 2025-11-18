import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

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
          <div className="nav-links">
            <Link to="/sociedades" className="nav-link" onClick={closeMenu}>
              Sociedades
            </Link>

            <Link to="/distribucion" className="nav-link" onClick={closeMenu}>
              Distribución
            </Link>
          </div>

          <div className="nav-cta">
            <Link to="/register" className="cta-button" onClick={closeMenu}>
              Registrarse
            </Link>
          </div>
          <button
            className="cta-button"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("usuario");
              window.location.href = "/login";
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}
