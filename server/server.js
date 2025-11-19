import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import sociedadesRoutes from "./routes/sociedadesRoutes.js";
import ingresosRoutes from "./routes/ingresosRoutes.js";
import distribucionesRoutes from "./routes/distribucionesRoutes.js";
import participacionesRouter from "./routes/participacionesRoutes.js";

const app = express();

// CORS CONFIGURADO CORRECTAMENTE
app.use(cors({
  origin: ['http://localhost:5173', 'https://flowy-self.vercel.app'],
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.options('*', cors());

app.use(express.json())

// RUTAS
app.use("/api/auth", authRoutes);
app.use("/api/sociedades", sociedadesRoutes);
app.use("/api/ingresos", ingresosRoutes);
app.use("/api/distribuciones", distribucionesRoutes);
app.use("/api/participaciones", participacionesRouter);

// Healthcheck
app.get('/api/health', (_req, res) => res.json({ ok: true }))

// Manejador de errores (catch-all)
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.message || err)
  res.status(500).json({ message: 'Error interno del servidor' })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ API escuchando en puerto ${PORT}`)
})
