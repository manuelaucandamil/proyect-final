import { supabaseAdmin } from "../db.js";

export async function registrarIngreso(req, res) {
  const { id_sociedad, monto, descripcion } = req.body;

  const { error } = await supabase
    .from("ingresos")
    .insert([{ id_sociedad, monto, descripcion }]);

  if (error) return res.status(400).json(error);

  res.json({ mensaje: "Ingreso registrado" });
}

export async function historialIngresos(req, res) {
  const { id_sociedad } = req.params;

  const { data, error } = await supabase
    .from("ingresos")
    .select("*")
    .eq("id_sociedad", id_sociedad)
    .order("fecha", { ascending: false });

  if (error) return res.status(400).json(error);

  res.json(data);
}
