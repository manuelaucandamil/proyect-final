const express = require("express");
const router = express.Router();
const pool = require("../db/supabase");
const auth = require("../authMiddleware");

// Registrar ingreso + repartir
router.post("/:idSociedad", auth, async (req, res) => {
  const { idSociedad } = req.params;
  const { monto, descripcion } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const ingreso = await client.query(
      `INSERT INTO ingresos(id_sociedad, monto, descripcion)
       VALUES ($1, $2, $3)
       RETURNING id_ingreso`,
      [idSociedad, monto, descripcion]
    );

    const idIngreso = ingreso.rows[0].id_ingreso;

    // Traer participaciones
    const { rows: socios } = await client.query(
      `SELECT id_usuario, porcentaje 
         FROM participaciones 
         WHERE id_sociedad = $1`,
      [idSociedad]
    );

    if (socios.length < 2) {
      return res.status(400).json({
        error: "Debe haber mínimo 2 socios para repartir el ingreso."
      });
    }

    // Calcular distribuciones
    for (const socio of socios) {
      const montoSocio = (monto * socio.porcentaje) / 100;

      await client.query(
        `INSERT INTO distribuciones(id_ingreso, id_usuario, monto)
         VALUES ($1, $2, $3)`,
        [idIngreso, socio.id_usuario, montoSocio]
      );
    }

    await client.query("COMMIT");

    res.json({
      message: "Ingreso registrado y distribuido correctamente.",
      id_ingreso: idIngreso
    });

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Error registrando ingreso" });
  } finally {
    client.release();
  }
});

// Obtener ingresos de una sociedad
router.get("/:idSociedad", auth, async (req, res) => {
  const { idSociedad } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT * FROM ingresos 
       WHERE id_sociedad = $1
       ORDER BY fecha DESC`,
      [idSociedad]
    );

    res.json(rows);
  } catch {
    res.status(500).json({ error: "Error obteniendo ingresos" });
  }
});

module.exports = router;
