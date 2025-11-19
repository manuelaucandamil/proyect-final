import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import { repartir, historialDistribuciones } from "../controllers/distribucionesController.js";

const router = express.Router();

router.post("/", auth, repartir);
router.get("/:id_sociedad", auth, historialDistribuciones);

export default router;
