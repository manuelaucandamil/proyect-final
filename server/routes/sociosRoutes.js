import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { crearSocio, obtenerSocios, eliminarSocio } from "../controllers/sociosController.js";

const router = Router();

router.post("/socios", auth, crearSocio);
router.get("/socios/:id_sociedad", auth, obtenerSocios);
router.delete("/socios/:id_socio", auth, eliminarSocio);

export default router;
