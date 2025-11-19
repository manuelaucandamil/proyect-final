// server/controllers/participacionesController.js
import { supabaseAdmin } from "../db/supabase.js";

/**
 * Crear participación (agregar socio a una sociedad)
 */
export async function crearParticipacion(req, res) {
  try {
    const { id_sociedad, id_usuario, porcentaje } = req.body;

    if (!id_sociedad || !id_usuario || porcentaje == null) {
      return res.status(400).json({
        mensaje: "id_sociedad, id_usuario y porcentaje son obligatorios"
      });
    }

    // Validar porcentaje correcto
    const pct = Number(porcentaje);
    if (isNaN(pct) || pct <= 0 || pct > 100) {
      return res.status(400).json({
        mensaje: "El porcentaje debe estar entre 0 y 100"
      });
    }

    // Insertar participación
    const { error } = await supabaseAdmin
      .from("participaciones")
      .insert([{
        id_sociedad,
        id_usuario,
        porcentaje: pct
      }]);

    if (error) {
      // violación de UNIQUE (id_usuario, id_sociedad)
      if (error.code === "23505") {
        return res.status(400).json({
          mensaje: "Ese usuario ya está registrado en esta sociedad"
        });
      }

      console.error("Error creando participación:", error);
      return res.status(400).json({
        mensaje: "No se pudo crear la participación"
      });
    }

    res.json({ mensaje: "Participación creada correctamente" });
  } catch (err) {
    console.error("Error en crearParticipacion:", err);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

/**
 * Listar participaciones de una sociedad
 */
export async function obtenerParticipaciones(req, res) {
  try {
    const { id_sociedad } = req.params;

    if (!id_sociedad) {
      return res.status(400).json({ mensaje: "id_sociedad es obligatorio" });
    }

    const { data, error } = await supabaseAdmin
      .from("participaciones")
      .select(`
        id_participacion,
        porcentaje,
        usuarios (
          id_usuario,
          nombre,
          email
        )
      `)
      .eq("id_sociedad", id_sociedad);

    if (error) {
      console.error("Error obteniendo participaciones:", error);
      return res.status(400).json({ mensaje: "No se pudieron obtener participaciones" });
    }

    res.json(data);
  } catch (err) {
    console.error("Error en obtenerParticipaciones:", err);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

/**
 * Actualizar porcentaje de participación
 */
export async function actualizarParticipacion(req, res) {
  try {
    const { id_participacion } = req.params;
    const { porcentaje } = req.body;

    if (porcentaje == null) {
      return res.status(400).json({ mensaje: "El porcentaje es obligatorio" });
    }

    const pct = Number(porcentaje);
    if (isNaN(pct) || pct <= 0 || pct > 100) {
      return res.status(400).json({
        mensaje: "El porcentaje debe estar entre 0 y 100"
      });
    }

    const { error } = await supabaseAdmin
      .from("participaciones")
      .update({ porcentaje: pct })
      .eq("id_participacion", id_participacion);

    if (error) {
      console.error("Error actualizando participación:", error);
      return res.status(400).json({ mensaje: "No se pudo actualizar la participación" });
    }

    res.json({ mensaje: "Participación actualizada" });
  } catch (err) {
    console.error("Error en actualizarParticipacion:", err);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

/**
 * Eliminar participación
 */
export async function eliminarParticipacion(req, res) {
  try {
    const { id_participacion } = req.params;

    const { error } = await supabaseAdmin
      .from("participaciones")
      .delete()
      .eq("id_participacion", id_participacion);

    if (error) {
      console.error("Error eliminando participación:", error);
      return res.status(400).json({ mensaje: "No se pudo eliminar la participación" });
    }

    res.json({ mensaje: "Participación eliminada" });
  } catch (err) {
    console.error("Error en eliminarParticipacion:", err);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}
