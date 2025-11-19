import { supabaseAdmin } from "../db.js";

export async function crearSociedad(req, res) {
  try {
    const { nombre, descripcion, codigo } = req.body;

    console.log("REQ.USER:", req.user); // para verificar autenticación

    const { error } = await supabaseAdmin
      .from("sociedades")
      .insert([
        {
          nombre,
          descripcion,
          codigo,
          creada_por: req.user.id_usuario,
        },
      ]);

    if (error) {
      console.error("Error DB:", error);
      return res.status(400).json(error);
    }

    res.json({ mensaje: "Sociedad creada" });
  } catch (err) {
    console.error("Error en crearSociedad:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function misSociedades(req, res) {
  try {
    const { data, error } = await supabaseAdmin
      .from("sociedades")
      .select("*")
      .eq("creada_por", req.user.id_usuario);

    if (error) {
      console.error("Error DB:", error);
      return res.status(400).json(error);
    }

    res.json(data);
  } catch (err) {
    console.error("Error en misSociedades:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
