// backend/server.js
import express from "express";
import cors from "cors";
import "dotenv/config";

import authRouter from "./routes/auth.js";
import sociedadesRouter from "./routes/sociedades.js";

const app = express();
const PORT = process.env.PORT || 4000;

const requiredEnv = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "JWT_SECRET"];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ ERROR: Falta la variable ${key} en el archivo .env`);
    process.exit(1);
  }
});

app.use(
  cors({
    origin: ["http://localhost:5173"], // tu frontend Vite
    credentials: true,
  })
);

app.use(express.json());

app.use("/api", authRouter);
app.use("/api", sociedadesRouter);

app.listen(PORT, () => {
  console.log(`🚀 Backend Flowy corriendo en http://localhost:${PORT}`);
});
