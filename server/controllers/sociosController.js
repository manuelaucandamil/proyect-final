// server/controllers/sociosController.js
import { supabaseAdmin } from "../db.js";

/**
 * Crear un socio dentro de una sociedad
 */
export async function crearSocio(req, res) {
  try {
    const { id_sociedad, nombre, porcentaje } = req.body;

    const { error } = await supabaseAdmin
      .from("socios")
      .insert([
        {
          id_sociedad,
          nombre,
          porcentaje,
          creado_por: req.user.id_usuario
        }
      ]);

    if (error) return res.status(400).json(error);

    res.json({ mensaje: "Socio creado" });
  } catch (err) {
    console.error("Error en crearSocio:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

/**
 * Obtener socios de una sociedad
 */
export async function obtenerSocios(req, res) {
  try {
    const { id_sociedad } = req.params;

    const { data, error } = await supabaseAdmin
      .from("socios")
      .select("*")
      .eq("id_sociedad", id_sociedad)
      .eq("creado_por", req.user.id_usuario);

    if (error) return res.status(400).json(error);

    res.json(data);
  } catch (err) {
    console.error("Error en obtenerSocios:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

/**
 * Eliminar socio
 */
export async function eliminarSocio(req, res) {
  try {
    const { id_socio } = req.params;

    const { error } = await supabaseAdmin
      .from("socios")
      .delete()
      .eq("id_socio", id_socio)
      .eq("creado_por", req.user.id_usuario);

    if (error) return res.status(400).json(error);

    res.json({ mensaje: "Socio eliminado" });
  } catch (err) {
    console.error("Error en eliminarSocio:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
