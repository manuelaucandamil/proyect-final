const express = require("express");
const router = express.Router();
const pool = require("../db/supabase"); 
const auth = require("../authMiddleware");

// Obtener participaciones de una sociedad
router.get("/:idSociedad", auth, async (req, res) => {
  const { idSociedad } = req.params;

  try {
    const { rows } = await pool.query(
      "SELECT * FROM participaciones WHERE id_sociedad = $1",
      [idSociedad]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo participaciones" });
  }
});

// Crear participación
router.post("/:idSociedad", auth, async (req, res) => {
  const { idSociedad } = req.params;
  const { id_usuario, porcentaje } = req.body;

  try {
    // Insertar participación
    await pool.query(
      `INSERT INTO participaciones(id_usuario, id_sociedad, porcentaje)
       VALUES ($1, $2, $3)`,
      [id_usuario, idSociedad, porcentaje]
    );

    // Validar que sumen 100%
    const { rows } = await pool.query(
      `SELECT SUM(porcentaje) AS total FROM participaciones WHERE id_sociedad = $1`,
      [idSociedad]
    );

    const total = parseFloat(rows[0].total);

    if (total !== 100) {
      return res.status(400).json({
        error: `Las participaciones deben sumar 100%. Actualmente suman ${total}%`
      });
    }

    res.json({ message: "Participación creada correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error creando participación" });
  }
});

// Eliminar participación
router.delete("/:idParticipacion", auth, async (req, res) => {
  const { idParticipacion } = req.params;

  try {
    await pool.query("DELETE FROM participaciones WHERE id_participacion = $1", [
      idParticipacion,
    ]);

    res.json({ message: "Participación eliminada" });
  } catch (err) {
    res.status(500).json({ error: "Error eliminando participación" });
  }
});

module.exports = router;
