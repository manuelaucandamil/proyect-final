// server/routes/ingresosRoutes.js
import express from "express";
import { authMiddleware } from "../authMiddleware.js";
import {
  registrarIngreso,
  historialIngresos
} from "../controllers/ingresosController.js";

const router = express.Router();

// Registrar ingreso
router.post("/", authMiddleware, registrarIngreso);

// Historial de ingresos por sociedad
router.get("/:id_sociedad", authMiddleware, historialIngresos);

export default router;
