import { supabaseAdmin } from "../db.js";

export async function repartir(req, res) {
  const { id_ingreso } = req.body;

  // 1. Leer ingreso
  const { data: ingreso } = await supabase
    .from("ingresos")
    .select("*")
    .eq("id_ingreso", id_ingreso)
    .single();

  const id_sociedad = ingreso.id_sociedad;
  const montoTotal = ingreso.monto;

  // 2. Obtener participaciones
  const { data: socios } = await supabase
    .from("participaciones")
    .select("id_usuario, porcentaje")
    .eq("id_sociedad", id_sociedad);

  // 3. Crear registro en distribuciones
  const { data: distribucion } = await supabase
    .from("distribuciones")
    .insert([{ id_ingreso }])
    .select()
    .single();

  // 4. Insertar valores de cada socio
  for (const s of socios) {
    const recibido = (montoTotal * s.porcentaje) / 100;

    await supabase
      .from("distribucion_detalle")
      .insert([
        {
          id_distribucion: distribucion.id_distribucion,
          id_usuario: s.id_usuario,
          porcentaje: s.porcentaje,
          valor_recibido: recibido
        }
      ]);
  }

  res.json({ mensaje: "Distribución generada" });
}

export async function historialDistribuciones(req, res) {
  const { id_sociedad } = req.params;

  const { data, error } = await supabase
    .from("distribuciones")
    .select("*, ingresos(monto, descripcion)")
    .eq("ingresos.id_sociedad", id_sociedad)
    .order("fecha", { ascending: false });

  if (error) return res.status(400).json(error);

  res.json(data);
}
