import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../index.css";

export default function RegistrarSociedad() {
    const [form, setForm] = useState({
        nombre: "",
        descripcion: "",
    });

    const [codigo, setCodigo] = useState("");
    const [mensaje, setMensaje] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // 🔵 Generar código manualmente (frontend)
    const generarCodigo = () => {
        const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numeros = Math.floor(Math.random() * 90000) + 10000;
        const prefijo =
            letras[Math.floor(Math.random() * letras.length)] +
            letras[Math.floor(Math.random() * letras.length)] +
            letras[Math.floor(Math.random() * letras.length)];

        const generado = `${prefijo}-${numeros}`;
        setCodigo(generado);
    };

    // 🔵 Guardar cambios
    const handleChange = (e) => {
        const { id, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    // 🔵 Enviar formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!form.nombre) {
            setMensaje({ texto: "Debes ingresar el nombre", tipo: "danger" });
            setLoading(false);
            return;
        }

        if (!codigo) {
            setMensaje({
                texto: "Debes generar un código para la sociedad",
                tipo: "danger",
            });
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/crear-sociedad", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nombre: form.nombre,
                    descripcion: form.descripcion,
                    porcentaje: 100, // creador inicia con 100%
                    codigo, // ahora se envía el código generado
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setMensaje({
                    texto: "Sociedad creada correctamente 🎉",
                    tipo: "success",
                });

                setTimeout(() => {
                    navigate("/sociedades");
                }, 1200);
            } else {
                if (res.status === 401) {
                    // Token inválido o expirado, redirigir a login
                    localStorage.removeItem("token");
                    localStorage.removeItem("usuario");
                    navigate("/login");
                    return;
                }
                setMensaje({ texto: data.mensaje, tipo: "danger" });
            }
        } catch {
            setMensaje({ texto: "Error conectando al servidor", tipo: "danger" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container fade-in">
            <Navbar />

            <main className="main-content">
                <div className="register-container fade-up">
                    <div className="register-card">
                        <div className="card-header">
                            <h3>Registrar Nueva Sociedad</h3>
                            <p>Crea una sociedad para comenzar a gestionar socios y repartos</p>
                        </div>

                        <div className="card-body">
                            {mensaje && (
                                <div className={`alert alert-${mensaje.tipo}`}>
                                    {mensaje.texto}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="register-form">
                                {/* Nombre */}
                                <div className="form-group">
                                    <label htmlFor="nombre" className="form-label">
                                        Nombre de la Sociedad
                                    </label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        className="form-control"
                                        placeholder="Ej: Flowy S.A.S"
                                        value={form.nombre}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* Código */}
                                <div className="form-group">
                                    <label className="form-label">Código único</label>

                                    <div className="codigo-box flex-between">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={codigo}
                                            placeholder="Genera un código único"
                                            disabled
                                        />

                                        <button
                                            type="button"
                                            className="btn btn-secondary ml-2"
                                            onClick={generarCodigo}
                                        >
                                            Generar
                                        </button>
                                    </div>
                                </div>

                                {/* Descripción */}
                                <div className="form-group">
                                    <label htmlFor="descripcion" className="form-label">
                                        Descripción
                                    </label>
                                    <textarea
                                        id="descripcion"
                                        className="form-control"
                                        placeholder="Opcional"
                                        value={form.descripcion}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>

                                {/* Botón */}
                                <button className="btn btn-primary w-100" disabled={loading}>
                                    {loading ? "Creando..." : "Crear Sociedad"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="login-footer">
                <p>&copy; 2025 Flowy | Manuela Urrea Candamil</p>
                <div className="footer-links">
                    <a href="https://www.instagram.com">Instagram</a>
                    <a href="https://www.whatsapp.com">Whatsapp</a>
                </div>
            </footer>
        </div>
    );
}