import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "../db.js";

export async function registrar(req, res) {
  const { nombre, email, password } = req.body;

  const password_hash = await bcrypt.hash(password, 10);

  const { error } = await supabase
    .from("usuarios")
    .insert([{ nombre, email, password_hash }]);

  if (error) return res.status(400).json(error);

  res.json({ mensaje: "Usuario registrado" });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const { data: user, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user) return res.status(400).json({ mensaje: "Usuario no existe" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(400).json({ mensaje: "Credenciales incorrectas" });

  const token = jwt.sign(
    { id_usuario: user.id_usuario, nombre: user.nombre },
    "CLAVE_SECRETA",
    { expiresIn: "5h" }
  );

  res.json({ token });
}
