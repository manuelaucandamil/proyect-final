// server/routes/sociedadesRoutes.js
import { Router } from "express";
import { authMiddleware } from "../authMiddleware.js";
import {
  crearSociedad,
  obtenerSociedades,
  eliminarSociedad,
} from "../controllers/sociedadesController.js";

const router = Router();

// Crear sociedad
router.post("/", authMiddleware, crearSociedad);

// Listar sociedades del usuario
router.get("/", authMiddleware, obtenerSociedades);

// Eliminar sociedad
router.delete("/:id_sociedad", authMiddleware, eliminarSociedad);

export default router;
