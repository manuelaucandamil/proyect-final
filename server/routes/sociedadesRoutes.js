import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import { crearSociedad, misSociedades } from "../controllers/sociedadesController.js";

const router = express.Router();

router.post("/", auth, crearSociedad);
router.get("/", auth, misSociedades);

export default router;
