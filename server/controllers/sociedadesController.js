// server/controllers/sociedadesController.js
import { supabaseAdmin } from "../db/supabase.js";

// Crear sociedad
export const crearSociedad = async (req, res) => {
  try {
    const { nombre, descripcion, codigo } = req.body;
    const id_usuario = req.user.id_usuario;

    if (!nombre || !codigo) {
      return res.status(400).json({ mensaje: "Nombre y código son obligatorios" });
    }

    // Verificar que el código no exista
    const { data: existente } = await supabaseAdmin
      .from("sociedades")
      .select("id_sociedad")
      .eq("codigo", codigo)
      .maybeSingle();

    if (existente) {
      return res.status(400).json({ mensaje: "Ya existe una sociedad con ese código" });
    }

    // Crear sociedad
    const { data, error } = await supabaseAdmin
      .from("sociedades")
      .insert({
        nombre,
        descripcion: descripcion || null,
        codigo,
        creada_por: id_usuario,
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ mensaje: "Sociedad creada", sociedad: data });
  } catch (error) {
    console.error("Error en crearSociedad:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

// Obtener sociedades del usuario
export const obtenerSociedades = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;

    const { data, error } = await supabaseAdmin
      .from("sociedades")
      .select("*")
      .eq("creada_por", id_usuario)
      .order("creado_en", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error("Error en obtenerSociedades:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

// Eliminar sociedad (solo del dueño)
export const eliminarSociedad = async (req, res) => {
  try {
    const { id_sociedad } = req.params;
    const id_usuario = req.user.id_usuario;

    // Verificar que la sociedad sea del usuario
    const { data: sociedad } = await supabaseAdmin
      .from("sociedades")
      .select("*")
      .eq("id_sociedad", id_sociedad)
      .maybeSingle();

    if (!sociedad) {
      return res.status(404).json({ mensaje: "Sociedad no encontrada" });
    }

    if (sociedad.creado_por !== id_usuario) {
      return res.status(403).json({ mensaje: "No tienes permiso para eliminar esta sociedad" });
    }

    // Eliminar
    const { error } = await supabaseAdmin
      .from("sociedades")
      .delete()
      .eq("id_sociedad", id_sociedad);

    if (error) throw error;

    res.json({ mensaje: "Sociedad eliminada correctamente" });
  } catch (error) {
    console.error("Error en eliminarSociedad:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};
