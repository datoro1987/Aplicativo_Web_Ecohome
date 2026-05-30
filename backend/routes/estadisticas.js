// backend/routes/estadisticas.js
const express = require('express');
const router  = express.Router();
const pool    = require('../config/db');

// ─────────────────────────────────────────────
//  GET /api/estadisticas/resumen
//  Tarjetas de resumen general
// ─────────────────────────────────────────────
router.get('/resumen', async (req, res) => {
    try {
        const [[{ total_kg }]] = await pool.query(
            `SELECT COALESCE(SUM(cantidad), 0) AS total_kg
             FROM registros_residuos WHERE unidad = 'kg'`
        );
        const [[{ total_usuarios }]] = await pool.query(
            `SELECT COUNT(*) AS total_usuarios FROM usuarios WHERE activo = 1`
        );
        const [[{ registros_mes }]] = await pool.query(
            `SELECT COUNT(*) AS registros_mes FROM registros_residuos
             WHERE MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE())`
        );
        const [[{ total_registros }]] = await pool.query(
            `SELECT COUNT(*) AS total_registros FROM registros_residuos`
        );

        res.json({
            ok: true,
            resumen: {
                total_kg: parseFloat(total_kg),
                total_usuarios,
                registros_mes,
                total_registros
            }
        });

    } catch (error) {
        console.error('Error en GET /estadisticas/resumen:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al obtener resumen' });
    }
});

// ─────────────────────────────────────────────
//  GET /api/estadisticas/por-tipo
//  Datos para el gráfico de torta general
// ─────────────────────────────────────────────
router.get('/por-tipo', async (req, res) => {
    try {
        const [filas] = await pool.query(
            `SELECT tipo_residuo,
                    COUNT(*) AS total_registros,
                    COALESCE(SUM(cantidad), 0) AS total_cantidad
             FROM registros_residuos
             GROUP BY tipo_residuo
             ORDER BY total_cantidad DESC`
        );

        const colores = ['#4CAF50','#2196F3','#FF9800','#9C27B0','#FF5722','#00BCD4','#795548'];

        res.json({
            ok: true,
            chartData: {
                labels:   filas.map(f => f.tipo_residuo.charAt(0).toUpperCase() + f.tipo_residuo.slice(1)),
                datasets: [{ data: filas.map(f => parseFloat(f.total_cantidad)), backgroundColor: colores.slice(0, filas.length) }]
            },
            detalle: filas
        });

    } catch (error) {
        console.error('Error en GET /estadisticas/por-tipo:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al obtener estadísticas por tipo' });
    }
});

// ─────────────────────────────────────────────
//  GET /api/estadisticas/por-mes
//  Datos para el gráfico de barras general
// ─────────────────────────────────────────────
router.get('/por-mes', async (req, res) => {
    try {
        const [filas] = await pool.query(
            `SELECT MONTH(fecha) AS mes_numero,
                    COALESCE(SUM(cantidad), 0) AS total_kg
             FROM registros_residuos
             WHERE YEAR(fecha) = YEAR(CURDATE())
             GROUP BY MONTH(fecha)
             ORDER BY mes_numero ASC`
        );

        const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

        res.json({
            ok: true,
            chartData: {
                labels:   filas.map(f => meses[f.mes_numero - 1]),
                datasets: [{ label: 'Kg reciclados', data: filas.map(f => parseFloat(f.total_kg)), backgroundColor: '#4CAF50' }]
            }
        });

    } catch (error) {
        console.error('Error en GET /estadisticas/por-mes:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al obtener estadísticas por mes' });
    }
});

// ─────────────────────────────────────────────
//  GET /api/estadisticas/usuario/:id
//  Estadísticas personales de un usuario
// ─────────────────────────────────────────────
router.get('/usuario/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [[{ total_kg }]] = await pool.query(
            `SELECT COALESCE(SUM(cantidad), 0) AS total_kg
            FROM registros_residuos WHERE usuario_id = ? AND unidad = 'kg'`, [id]
        );
        const [[{ total_registros }]] = await pool.query(
            `SELECT COUNT(*) AS total_registros
            FROM registros_residuos WHERE usuario_id = ?`, [id]
        );
        const [[{ registros_mes }]] = await pool.query(
            `SELECT COUNT(*) AS registros_mes FROM registros_residuos
            WHERE usuario_id = ?
            AND MONTH(fecha) = MONTH(CURDATE())
            AND YEAR(fecha) = YEAR(CURDATE())`, [id]
        );
        const [porTipo] = await pool.query(
            `SELECT tipo_residuo,
                    COALESCE(SUM(cantidad), 0) AS total_cantidad
            FROM registros_residuos WHERE usuario_id = ?
            GROUP BY tipo_residuo ORDER BY total_cantidad DESC`, [id]
        );
        const [porMes] = await pool.query(
            `SELECT MONTH(fecha) AS mes_numero,
                    COALESCE(SUM(cantidad), 0) AS total_kg
            FROM registros_residuos
            WHERE usuario_id = ? AND YEAR(fecha) = YEAR(CURDATE())
            GROUP BY MONTH(fecha) ORDER BY mes_numero ASC`, [id]
        );

        const meses   = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
        const colores = ['#4CAF50','#2196F3','#FF9800','#9C27B0','#FF5722','#00BCD4','#795548'];

        res.json({
            ok: true,
            resumen: {
                total_kg:        parseFloat(total_kg),
                total_registros,
                registros_mes
            },
            graficoTipos: {
                labels:   porTipo.map(f => f.tipo_residuo.charAt(0).toUpperCase() + f.tipo_residuo.slice(1)),
                datasets: [{ data: porTipo.map(f => parseFloat(f.total_cantidad)), backgroundColor: colores }]
            },
            graficoMeses: {
                labels:   porMes.map(f => meses[f.mes_numero - 1]),
                datasets: [{ label: 'Kg reciclados', data: porMes.map(f => parseFloat(f.total_kg)), backgroundColor: '#4CAF50' }]
            }
        });

    } catch (error) {
        console.error('Error en GET /estadisticas/usuario/:id:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al obtener estadísticas del usuario' });
    }
});

module.exports = router;