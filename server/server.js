// server/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import sociedadesRoutes from "./routes/sociedadesRoutes.js";
import ingresosRoutes from "./routes/ingresosRoutes.js";
import distribucionesRoutes from "./routes/distribucionesRoutes.js";
import participacionesRouter from "./routes/participacionesRoutes.js";

const app = express();

// ==========================
// 🔐 CORS (simple y funcional)
// ==========================

// Versión súper simple: permite cualquier origen.
// Para tu caso (Authorization por header, sin cookies) está bien.
app.use(cors());

// Si más adelante quieres restringir, puedes usar algo así:
//
// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://flowy-self.vercel.app"
// ];
//
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // Permitir también herramientas como Postman (sin origin)
//       if (!origin || allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }
//       return callback(new Error("Origen no permitido por CORS"));
//     },
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// (Opcional) Log para ver qué está llegando
app.use((req, _res, next) => {
  console.log(`🌐 ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// ==========================
// 🧩 Middlewares base
// ==========================
app.use(express.json());

// ==========================
// 🛣️ Rutas
// ==========================
app.use("/api/auth", authRoutes);
app.use("/api/sociedades", sociedadesRoutes);
app.use("/api/ingresos", ingresosRoutes);
app.use("/api/distribuciones", distribucionesRoutes);
app.use("/api/participaciones", participacionesRouter);

// Healthcheck
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Manejador de errores (catch-all)
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err.message || err);
  res.status(500).json({ message: "Error interno del servidor" });
});

// ==========================
// 🚀 Levantar servidor
// ==========================
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ API escuchando en puerto ${PORT}`);
});
