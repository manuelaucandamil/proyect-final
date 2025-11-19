// server.js (dentro de /server)
import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import sociedadesRoutes from "./routes/sociedadesRoutes.js";
import ingresosRoutes from "./routes/ingresosRoutes.js";
import distribucionesRoutes from "./routes/distribucionesRoutes.js";
import participacionesRouter from "./routes/participacionesRoutes.js";

const app = express();

// 🔐 CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://flowy-self.vercel.app" // o el dominio real de tu frontend
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.options("*", cors());

// Logs
app.use((req, _res, next) => {
  console.log(`🌐 ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// JSON
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/sociedades", sociedadesRoutes);
app.use("/api/ingresos", ingresosRoutes);
app.use("/api/distribuciones", distribucionesRoutes);
app.use("/api/participaciones", participacionesRouter);

// Healthcheck
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Error genérico
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err.message || err);
  res.status(500).json({ message: "Error interno del servidor" });
});

// Arrancar
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ API escuchando en puerto ${PORT}`);
});
