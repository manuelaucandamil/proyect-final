import express from "express";
import cors from "cors";

// Rutas
import authRoutes from "./routes/authRoutes.js";
import sociedadesRoutes from "./routes/sociedadesRoutes.js";
import sociosRoutes from "./routes/sociosRoutes.js";
import ingresosRoutes from "./routes/ingresosRoutes.js";
import distribucionesRoutes from "./routes/distribucionesRoutes.js";

const app = express();

app.use(cors({
  origin: "*", // cuando subas a Vercel cámbialo por tu dominio
}));

app.use(express.json());

// Registrar rutas
app.use("/auth", authRoutes);
app.use("/sociedades", sociedadesRoutes);
app.use("/socios", sociosRoutes);
app.use("/ingresos", ingresosRoutes);
app.use("/distribuciones", distribucionesRoutes);

app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
