import express from "express";
import { supabaseAdmin } from "../db/supabase.js";
import { verifyToken } from "../authMiddleware.js";

const router = express.Router();

/*
=====================================================
  MIS SOCIEDADES
=====================================================
*/
router.get("/mis-sociedades", verifyToken, async (req, res) => {
  const { id_usuario } = req.user;

  const { data, error } = await supabaseAdmin
    .from("participaciones")
    .select(`
      porcentaje,
      sociedades (
        id_sociedad,
        nombre,
        descripcion,
        codigo
      )
    `)
    .eq("id_usuario", id_usuario);

  if (error) {
    console.error(error);
    return res.status(500).json({ mensaje: "Error obteniendo sociedades" });
  }

  return res.json(
    data.map((item) => ({
      id_sociedad: item.sociedades.id_sociedad,
      nombre: item.sociedades.nombre,
      descripcion: item.sociedades.descripcion,
      codigo: item.sociedades.codigo,
      porcentaje: item.porcentaje,
    }))
  );
});

/*
=====================================================
  UNIRSE A OTRA SOCIEDAD
=====================================================
*/
router.post("/unirme-sociedad", verifyToken, async (req, res) => {
  const { id_usuario } = req.user;
  const { codigoSociedad, porcentaje } = req.body;

  try {
    // Buscar sociedad
    const { data: sociedad } = await supabaseAdmin
      .from("sociedades")
      .select("*")
      .eq("codigo", codigoSociedad)
      .single();

    if (!sociedad) {
      return res.status(400).json({ mensaje: "Código inválido" });
    }

    // Verificar si ya participa
    const { data: existe } = await supabaseAdmin
      .from("participaciones")
      .select("*")
      .eq("id_usuario", id_usuario)
      .eq("id_sociedad", sociedad.id_sociedad)
      .maybeSingle();

    if (existe) {
      return res.status(400).json({ mensaje: "Ya estás en esta sociedad" });
    }

    // Validar suma de porcentajes
    const { data: participaciones } = await supabaseAdmin
      .from("participaciones")
      .select("porcentaje")
      .eq("id_sociedad", sociedad.id_sociedad);

    const suma = participaciones?.reduce(
      (acc, p) => acc + Number(p.porcentaje),
      0
    ) || 0;

    if (suma + Number(porcentaje) > 100) {
      return res.status(400).json({
        mensaje: "La suma de porcentajes excede el 100%",
      });
    }

    // Insertar participación
    await supabaseAdmin.from("participaciones").insert({
      id_usuario,
      id_sociedad: sociedad.id_sociedad,
      porcentaje,
    });

    return res.json({ mensaje: "Te uniste correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: "Error en el servidor" });
  }
});

/*
=====================================================
  CREAR SOCIEDAD
=====================================================
*/
router.post("/crear-sociedad", verifyToken, async (req, res) => {
  const { id_usuario } = req.user;
  const { nombre, descripcion, porcentaje } = req.body;

  try {
    if (!nombre || !porcentaje) {
      return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
    }

    // Generar código único
    const codigo = "FLOWY-" + Math.floor(100000 + Math.random() * 900000);

    // Crear sociedad
    const { data: sociedad, error: errorSoc } = await supabaseAdmin
      .from("sociedades")
      .insert({
        nombre,
        descripcion,
        codigo,
      })
      .select()
      .single();

    if (errorSoc) {
      console.error(errorSoc);
      return res.status(500).json({ mensaje: "Error creando la sociedad" });
    }

    // Registrar participación del creador
    const { error: errorPart } = await supabaseAdmin
      .from("participaciones")
      .insert({
        id_usuario,
        id_sociedad: sociedad.id_sociedad,
        porcentaje,
      });

    if (errorPart) {
      console.error(errorPart);
      return res.status(500).json({ mensaje: "Error guardando tu porcentaje" });
    }

    return res.json({
      mensaje: "Sociedad creada exitosamente",
      sociedad,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: "Error en el servidor" });
  }
});

export default router;
