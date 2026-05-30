// backend/routes/residuos.js
const express = require('express');
const router  = express.Router();
const pool    = require('../config/db');

// ─────────────────────────────────────────────
//  GET /api/residuos
//  Lista todos los registros de residuos
// ─────────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const [residuos] = await pool.query(
            `SELECT r.id, u.nombre_completo, r.tipo_residuo, r.cantidad,
                    r.unidad, r.fecha, r.descripcion, r.fecha_registro
            FROM registros_residuos r
            JOIN usuarios u ON r.usuario_id = u.id
            ORDER BY r.fecha_registro DESC`
        );

        res.json({
            ok: true,
            total: residuos.length,
            residuos
        });

    } catch (error) {
        console.error('Error en GET /residuos:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al obtener residuos' });
    }
});

// ─────────────────────────────────────────────
//  GET /api/residuos/:id
//  Ver un registro por su ID
// ─────────────────────────────────────────────
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [filas] = await pool.query(
            `SELECT r.id, u.nombre_completo, r.tipo_residuo, r.cantidad,
                    r.unidad, r.fecha, r.descripcion, r.fecha_registro
            FROM registros_residuos r
            JOIN usuarios u ON r.usuario_id = u.id
            WHERE r.id = ?`, [id]
        );

        if (filas.length === 0) {
            return res.status(404).json({ ok: false, mensaje: 'Registro no encontrado' });
        }

        res.json({ ok: true, residuo: filas[0] });

    } catch (error) {
        console.error('Error en GET /residuos/:id:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al obtener el registro' });
    }
});

// ─────────────────────────────────────────────
//  POST /api/residuos
//  Crear un nuevo registro de residuo
// ─────────────────────────────────────────────
router.post('/', async (req, res) => {
    try {
        const { usuario_id, tipo_residuo, cantidad, unidad, fecha, descripcion } = req.body;

        // 1. Validar campos obligatorios
        if (!usuario_id || !tipo_residuo || !cantidad || !fecha) {
            return res.status(400).json({
                ok: false,
                mensaje: 'usuario_id, tipo_residuo, cantidad y fecha son obligatorios'
            });
        }

        // 2. Validar que el tipo de residuo sea válido
        const tiposValidos = ['plastico', 'papel', 'vidrio', 'metal', 'organico', 'electronico', 'textil'];
        if (!tiposValidos.includes(tipo_residuo)) {
            return res.status(400).json({
                ok: false,
                mensaje: `tipo_residuo debe ser uno de: ${tiposValidos.join(', ')}`
            });
        }

        // 3. Verificar que el usuario existe
        const [usuario] = await pool.query(
            'SELECT id FROM usuarios WHERE id = ?', [usuario_id]
        );
        if (usuario.length === 0) {
            return res.status(404).json({ ok: false, mensaje: 'El usuario no existe' });
        }

        // 4. Insertar en la base de datos
        const [resultado] = await pool.query(
            `INSERT INTO registros_residuos (usuario_id, tipo_residuo, cantidad, unidad, fecha, descripcion)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [usuario_id, tipo_residuo, cantidad, unidad || 'kg', fecha, descripcion || null]
        );

        res.status(201).json({
            ok: true,
            mensaje: 'Residuo registrado exitosamente',
            residuo: {
                id: resultado.insertId,
                usuario_id,
                tipo_residuo,
                cantidad,
                unidad: unidad || 'kg',
                fecha
            }
        });

    } catch (error) {
        console.error('Error en POST /residuos:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al registrar residuo' });
    }
});

// ─────────────────────────────────────────────
//  PUT /api/residuos/:id
//  Actualizar un registro de residuo
// ─────────────────────────────────────────────
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo_residuo, cantidad, unidad, fecha, descripcion } = req.body;

        // 1. Verificar que el registro existe
        const [filas] = await pool.query(
            'SELECT id FROM registros_residuos WHERE id = ?', [id]
        );
        if (filas.length === 0) {
            return res.status(404).json({ ok: false, mensaje: 'Registro no encontrado' });
        }

        // 2. Armar solo los campos que llegaron
        let camposActualizar = { tipo_residuo, cantidad, unidad, fecha, descripcion };
        Object.keys(camposActualizar).forEach(
            key => camposActualizar[key] === undefined && delete camposActualizar[key]
        );

        // 3. Actualizar
        await pool.query(
            'UPDATE registros_residuos SET ? WHERE id = ?',
            [camposActualizar, id]
        );

        res.json({ ok: true, mensaje: 'Registro actualizado correctamente' });

    } catch (error) {
        console.error('Error en PUT /residuos/:id:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al actualizar registro' });
    }
});

// ─────────────────────────────────────────────
//  DELETE /api/residuos/:id
//  Eliminar un registro de residuo
// ─────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Verificar que existe
        const [filas] = await pool.query(
            'SELECT id, tipo_residuo FROM registros_residuos WHERE id = ?', [id]
        );
        if (filas.length === 0) {
            return res.status(404).json({ ok: false, mensaje: 'Registro no encontrado' });
        }

        // 2. Eliminar
        await pool.query('DELETE FROM registros_residuos WHERE id = ?', [id]);

        res.json({
            ok: true,
            mensaje: `Registro de "${filas[0].tipo_residuo}" eliminado correctamente`
        });

    } catch (error) {
        console.error('Error en DELETE /residuos/:id:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al eliminar registro' });
    }
});

module.exports = router;