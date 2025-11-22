// server/controllers/authController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "../db/supabase.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

// POST /api/auth/register
export async function registrar(req, res) {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ mensaje: "Nombre, email y password son obligatorios" });
    }

    // Hashear contraseña
    const password_hash = await bcrypt.hash(password, 10);

    const { error } = await supabaseAdmin
      .from("usuarios")
      .insert([{ nombre, email, password_hash }]);


    if (error) {
      console.error("Error insertando usuario:", error);
      // Si es email duplicado (unique violation)
      if (error.code === "23505") {
        return res.status(400).json({ mensaje: "Ya existe un usuario con ese email" });
      }
      return res.status(400).json({ mensaje: "No se pudo registrar el usuario" });
    }


    return res.json({ mensaje: "Usuario registrado" });
  } catch (err) {
    console.error("Error en registrar:", err);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}


// POST /api/auth/login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ mensaje: "Email y password son obligatorios" });
    }

    const { data: user, error } = await supabaseAdmin
      .from("usuarios")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      console.error("Error buscando usuario:", error);
      return res.status(400).json({ mensaje: "Usuario no existe" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(400).json({ mensaje: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      { id_usuario: user.id_usuario, nombre: user.nombre },
      JWT_SECRET,
      { expiresIn: "5h" }
    );

    return res.json({ token });
  } catch (err) {
    console.error("Error en login:", err);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}
