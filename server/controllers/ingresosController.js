// server/controllers/ingresosController.js
import { supabaseAdmin } from "../db/supabase.js";

// POST /api/ingresos
export async function registrarIngreso(req, res) {
  try {
    const { id_sociedad, monto, descripcion } = req.body;

    if (!id_sociedad || !monto) {
      return res.status(400).json({
        mensaje: "id_sociedad y monto son obligatorios"
      });
    }

    const montoNumero = Number(monto);
    if (Number.isNaN(montoNumero) || montoNumero <= 0) {
      return res.status(400).json({
        mensaje: "El monto debe ser un número mayor a 0"
      });
    }

    const { error } = await supabaseAdmin
      .from("ingresos")
      .insert([{
        id_sociedad,
        monto: montoNumero,
        descripcion: descripcion || null
      }]);

    if (error) {
      console.error("Error registrando ingreso:", error);
      return res.status(400).json({ mensaje: "No se pudo registrar el ingreso" });
    }

    return res.json({ mensaje: "Ingreso registrado correctamente" });
  } catch (err) {
    console.error("Error en registrarIngreso:", err);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

// GET /api/ingresos/:id_sociedad
export async function historialIngresos(req, res) {
  try {
    const { id_sociedad } = req.params;

    if (!id_sociedad) {
      return res.status(400).json({ mensaje: "id_sociedad es obligatorio" });
    }

    const { data, error } = await supabaseAdmin
      .from("ingresos")
      .select("*")
      .eq("id_sociedad", id_sociedad)
      .order("fecha", { ascending: false });

    if (error) {
      console.error("Error consultando ingresos:", error);
      return res.status(400).json({ mensaje: "No se pudieron obtener los ingresos" });
    }

    return res.json(data);
  } catch (err) {
    console.error("Error en historialIngresos:", err);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

export async function ingresoIndividual(req, res) {
  try {
    const { id_sociedad } = req.params;
    if (!id_sociedad) {
      return res.status(400).json({ mensaje: "id_ingreso es obligatorio" });
    }
    const { data, error } = await supabaseAdmin
      .from("ingresos")
      .select("*")
      .eq("id_sociedad", id_sociedad)
    if (error) {
      console.error("Error consultando ingreso individual:", error);
      return res.status(400).json({ mensaje: "No se pudo obtener el ingreso" });
    }
    console.log("Ingreso individual obtenido:", data);
    return res.json(data);
      
  }catch (err) {
    console.error("Error en ingresoIndividual:", err);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}