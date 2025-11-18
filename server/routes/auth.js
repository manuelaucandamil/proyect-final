import express from "express";
import bcrypt from "bcrypt";
import { supabaseAdmin } from "../db/supabase.js";
import { generarToken } from "../authMiddleware.js";

const router = express.Router();

/*
=====================================================
  REGISTRO: usuario + unión a sociedad
=====================================================
*/
router.post("/registro", async (req, res) => {
  const { nombre, email, password, codigoSociedad, porcentaje } = req.body;

  try {
    // VALIDAR CAMPOS
    if (!nombre || !email || !password || !codigoSociedad || !porcentaje) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    // 1. Revisar si el email ya existe
    const { data: existe } = await supabaseAdmin
      .from("usuarios")
      .select("id_usuario")
      .eq("email", email)
      .maybeSingle();

    if (existe) {
      return res.status(400).json({ mensaje: "Ya existe un usuario con ese correo" });
    }

    // 2. Crear usuario
    const hash = await bcrypt.hash(password, 10);

    const { data: usuario, error: errorUsuario } = await supabaseAdmin
      .from("usuarios")
      .insert({
        nombre,
        email,
        password_hash: hash
      })
      .select()
      .single();

    if (errorUsuario) {
      return res.status(500).json({ mensaje: "Error al registrar usuario" });
    }

    // 3. Buscar sociedad por código
    const { data: sociedad } = await supabaseAdmin
      .from("sociedades")
      .select("*")
      .eq("codigo", codigoSociedad)
      .single();

    if (!sociedad) {
      return res.status(400).json({ mensaje: "El código de la sociedad no existe" });
    }

    // 4. Validar suma de porcentajes
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
        mensaje: "La suma de porcentajes excede el 100%"
      });
    }

    // 5. Insertar participación
    await supabaseAdmin
      .from("participaciones")
      .insert({
        id_usuario: usuario.id_usuario,
        id_sociedad: sociedad.id_sociedad,
        porcentaje
      });

    // 6. Generar token
    const token = generarToken({
      id_usuario: usuario.id_usuario,
      email: usuario.email
    });

    return res.json({
      mensaje: "Usuario registrado correctamente",
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });

  } catch (error) {
    console.error("Error en /registro:", error);
    return res.status(500).json({ mensaje: "Error en el servidor" });
  }
});

/*
=====================================================
  LOGIN
=====================================================
*/
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data: usuario } = await supabaseAdmin
      .from("usuarios")
      .select("*")
      .eq("email", email)
      .single();

    if (!usuario) {
      return res.status(400).json({ mensaje: "Correo o contraseña incorrectos" });
    }

    const valid = await bcrypt.compare(password, usuario.password_hash);
    if (!valid) {
      return res.status(400).json({ mensaje: "Correo o contraseña incorrectos" });
    }

    const token = generarToken({
      id_usuario: usuario.id_usuario,
      email: usuario.email
    });

    return res.json({
      login: true,
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });

  } catch (error) {
    console.error("Error en /login:", error);
    return res.status(500).json({ mensaje: "Error en el servidor" });
  }
});

export default router;
