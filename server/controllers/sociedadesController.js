import { supabaseAdmin } from "../db.js";

export async function crearSociedad(req, res) {
  const { nombre, descripcion, codigo } = req.body;

  const { error } = await supabase
    .from("sociedades")
    .insert([{ nombre, descripcion, codigo, creada_por: req.user.id_usuario }]);

  if (error) return res.status(400).json(error);

  res.json({ mensaje: "Sociedad creada" });
}

export async function misSociedades(req, res) {
  const { data, error } = await supabase
    .from("sociedades")
    .select("*")
    .eq("creada_por", req.user.id_usuario);

  if (error) return res.status(400).json(error);

  res.json(data);
}
