// server/routes/participacionesRoutes.js
import express from "express";
import {
  crearParticipacion,
  obtenerParticipaciones,
  actualizarParticipacion,
  eliminarParticipacion
} from "../controllers/participacionesController.js";
import { authMiddleware } from "../authMiddleware.js";

const router = express.Router();

// Crear participación
router.post("/", authMiddleware, crearParticipacion);

// Listar participaciones de una sociedad
router.get("/:id_sociedad", authMiddleware, obtenerParticipaciones);

// Actualizar porcentaje de participación
router.put("/:id_participacion", authMiddleware, actualizarParticipacion);

// Eliminar participación
router.delete("/:id_participacion", authMiddleware, eliminarParticipacion);

export default router;
