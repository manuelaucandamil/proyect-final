import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import { registrarIngreso, historialIngresos } from "../controllers/ingresosController.js";

const router = express.Router();

router.post("/", auth, registrarIngreso);
router.get("/:id_sociedad", auth, historialIngresos);

export default router;
