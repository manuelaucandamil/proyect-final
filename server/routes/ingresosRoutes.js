// server/routes/ingresosRoutes.js
import express from "express";
import { authMiddleware } from "../authMiddleware.js";
import {
  registrarIngreso,
  historialIngresos,
  ingresoIndividual
} from "../controllers/ingresosController.js";

const router = express.Router();

// Registrar ingreso
router.post("/", authMiddleware, registrarIngreso);

router.get("/ingreso/:id_sociedad", ingresoIndividual );

// Historial de ingresos por sociedad
router.get("/:id_sociedad", authMiddleware, historialIngresos);

export default router;
