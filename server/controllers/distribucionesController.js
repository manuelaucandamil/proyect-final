// server/controllers/distribucionesController.js
import { supabaseAdmin } from "../db/supabase.js";

export async function repartir(req, res) {
  try {
    const { id_ingreso } = req.body;

    if (!id_ingreso) {
      return res.status(400).json({ mensaje: "id_ingreso es obligatorio" });
    }

    // 1. Leer ingreso
    const { data: ingreso, error: errorIngreso } = await supabaseAdmin
      .from("ingresos")
      .select("*")
      .eq("id_ingreso", id_ingreso)
      .single();

    if (errorIngreso || !ingreso) {
      return res.status(404).json({ mensaje: "Ingreso no encontrado" });
    }

    const id_sociedad = ingreso.id_sociedad;
    const montoTotal = Number(ingreso.monto);

    // 2. Obtener participaciones
    const { data: socios, error: errorSocios } = await supabaseAdmin
      .from("participaciones")
      .select("id_usuario, porcentaje")
      .eq("id_sociedad", id_sociedad);

    if (errorSocios) {
      return res.status(400).json({ mensaje: "Error al obtener participaciones" });
    }

    if (!socios || socios.length === 0) {
      return res.status(400).json({ mensaje: "La sociedad no tiene participaciones registradas" });
    }

    // 3. Crear registro en distribuciones
    const { data: distribucion, error: errorDistrib } = await supabaseAdmin
      .from("distribuciones")
      .insert([{ id_ingreso }])
      .select()
      .single();

    if (errorDistrib) {
      return res.status(400).json({ mensaje: "Error creando distribución" });
    }

    const detalles = socios.map(s => ({
      id_distribucion: distribucion.id_distribucion,
      id_usuario: s.id_usuario,
      porcentaje: s.porcentaje,
      valor_recibido: Number(((montoTotal * s.porcentaje) / 100).toFixed(2)),
    }));

    // 4. Insertar TODOS los detalles de una vez
    const { error: errorDetalle } = await supabaseAdmin
      .from("distribucion_detalle")
      .insert(detalles);

    if (errorDetalle) {
      return res.status(400).json({ mensaje: "Error insertando detalle de distribución" });
    }

    return res.json({
      mensaje: "Distribución generada correctamente",
      distribucion: distribucion.id_distribucion
    });

  } catch (err) {
    console.error("Error en repartir:", err);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}


export async function historialDistribuciones(req, res) {
  try {
    const { id_sociedad } = req.params;

    const { data, error } = await supabaseAdmin
      .from("distribuciones")
      .select(`
        id_distribucion,
        fecha,
        ingresos (
          id_ingreso,
          monto,
          descripcion,
          id_sociedad
        )
      `)
      .order("fecha", { ascending: false });

    if (error) {
      return res.status(400).json(error);
    }

    // Filtrar solo las distribuciones de esa sociedad
    const filtrado = data.filter(d => d.ingresos?.id_sociedad === Number(id_sociedad));

    return res.json(filtrado);
    
  } catch (err) {
    console.error("Error en historial:", err);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

// Obtener el detalle de una distribución
export async function detalleDistribucion(req, res) {
  try {
    const { id_distribucion } = req.params;

    if (!id_distribucion) {
      return res.status(400).json({ mensaje: "El id_distribucion es obligatorio" });
    }

    // 1. Obtener la distribución y su ingreso asociado
    const { data: distribucion, error: errorDist } = await supabaseAdmin
      .from("distribuciones")
      .select(`
        id_distribucion,
        fecha,
        ingresos (
          id_ingreso,
          monto,
          descripcion,
          id_sociedad
        )
      `)
      .eq("id_distribucion", id_distribucion)
      .single();

    if (errorDist || !distribucion) {
      console.error("Error buscando distribución:", errorDist);
      return res.status(404).json({ mensaje: "Distribución no encontrada" });
    }

    // 2. Obtener el detalle: usuarios, porcentajes y valores recibidos
    const { data: detalle, error: errorDetalle } = await supabaseAdmin
      .from("distribucion_detalle")
      .select(`
        id_detalle,
        porcentaje,
        valor_recibido,
        usuarios (
          id_usuario,
          nombre,
          email
        )
      `)
      .eq("id_distribucion", id_distribucion);

    if (errorDetalle) {
      console.error("Error buscando detalles:", errorDetalle);
      return res.status(400).json({ mensaje: "Error obteniendo los detalles" });
    }

    res.json({
      distribucion,
      detalle
    });

  } catch (err) {
    console.error("Error en detalleDistribucion:", err);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

