// server/routes/distribucionesRoutes.js
import express from "express";
import { authMiddleware } from "../authMiddleware.js";
import {
  repartir,
  historialDistribuciones,
  detalleDistribucion
} from "../controllers/distribucionesController.js";

const router = express.Router();

// Crear distribución (repartir un ingreso)
router.post("/", authMiddleware, repartir);

// Obtener historial por sociedad
router.get("/sociedad/:id_sociedad", authMiddleware, historialDistribuciones);

// Obtener detalle de una distribución específica
router.get("/detalle/:id_distribucion", detalleDistribucion);

export default router;
