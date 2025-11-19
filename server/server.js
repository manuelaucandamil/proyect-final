import "dotenv/config";
import express from "express";

import authRoutes from "./routes/authRoutes.js";
import sociedadesRoutes from "./routes/sociedadesRoutes.js";
import ingresosRoutes from "./routes/ingresosRoutes.js";
import distribucionesRoutes from "./routes/distribucionesRoutes.js";
import participacionesRouter from "./routes/participacionesRoutes.js";

const app = express();

// ==========================
// 🔐 CORS MANUAL
// ==========================
const allowedOrigins = [
  "http://localhost:5173",
  "https://flowy-self.vercel.app", // tu front en producción
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Vary", "Origin");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// ==========================
// Middlewares y rutas
// ==========================
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sociedades", sociedadesRoutes);
app.use("/api/ingresos", ingresosRoutes);
app.use("/api/distribuciones", distribucionesRoutes);
app.use("/api/participaciones", participacionesRouter);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Error interno del servidor" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ API escuchando en puerto ${PORT}`);
});
