// server/routes/authRoutes.js
import express from "express";
import { registrar, login } from "../controllers/authController.js";
import { authMiddleware } from "../authMiddleware.js";

const router = express.Router();

// Registro
router.post("/register", registrar);

// Login
router.post("/login", login);

// Verificar token (opcional pero MUY útil)
router.get("/check", authMiddleware, (req, res) => {
  res.json({ ok: true, usuario: req.user });
});

export default router;
