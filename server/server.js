import "dotenv/config";
import express from "express";
import cors from "cors";
import { supabaseAdmin } from "./db/supabase.js";

import authRoutes from "./routes/authRoutes.js";
import sociedadesRoutes from "./routes/sociedadesRoutes.js";
import ingresosRoutes from "./routes/ingresosRoutes.js";
import distribucionesRoutes from "./routes/distribucionesRoutes.js";
import sociosRouter from "./routes/sociosRoutes.js";

const app = express();

// CORS CONFIGURADO CORRECTAMENTE
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

// RUTAS
app.use("/auth", authRoutes);
app.use("/sociedades", sociedadesRoutes);
app.use("/ingresos", ingresosRoutes);
app.use("/distribuciones", distribucionesRoutes);
app.use("/socios", sociosRouter);

// RUTA DE PRUEBA
app.get("/", (_, res) => res.send("Backend funcionando 🚀"));

// PUERTO DESDE .env
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
