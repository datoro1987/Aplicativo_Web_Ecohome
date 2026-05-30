// backend/routes/auth.js
const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const pool    = require('../config/db');

// ─────────────────────────────────────────────
//  GET /api/auth/usuarios
//  Lista todos los usuarios registrados
// ─────────────────────────────────────────────
router.get('/usuarios', async (req, res) => {
    try {
        const [usuarios] = await pool.query(
            `SELECT id, nombre_completo, email, telefono, fecha_registro, activo
            FROM usuarios
            ORDER BY fecha_registro DESC`
        );

        res.json({
            ok: true,
            total: usuarios.length,
            usuarios
        });

    } catch (error) {
        console.error('Error en GET /usuarios:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al obtener usuarios' });
    }
});


//  GET /api/auth/usuarios/:id

router.get('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [filas] = await pool.query(
            `SELECT id, nombre_completo, email, telefono, fecha_registro, activo
            FROM usuarios WHERE id = ?`,
            [id]
        );

        if (filas.length === 0) {
            return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' });
        }

        res.json({ ok: true, usuario: filas[0] });

    } catch (error) {
        console.error('Error en GET /usuarios/:id:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al obtener usuario' });
    }
});


//  POST /api/auth/register

router.post('/register', async (req, res) => {
    try {
        const { nombre_completo, email, password, telefono } = req.body;

        //Validar campos obligatorios

        if (!nombre_completo || !email || !password) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Nombre, email y contraseña son obligatorios'
            });
        }

        //Verificar que el email no exista
        
        const [existe] = await pool.query(
            'SELECT id FROM usuarios WHERE email = ?', [email]
        );
        if (existe.length > 0) {
            return res.status(409).json({
                ok: false,
                mensaje: 'Ya existe una cuenta con ese correo electrónico'
            });
        }

        //Hashear la contraseña


        const salt         = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        //Insertar en la base de datos

        const [resultado] = await pool.query(
            `INSERT INTO usuarios (nombre_completo, email, password, telefono)
            VALUES (?, ?, ?, ?)`,
            [nombre_completo, email, passwordHash, telefono || null]
        );

        res.status(201).json({
            ok: true,
            mensaje: 'Usuario registrado exitosamente',
            usuario: {
                id: resultado.insertId,
                nombre_completo,
                email
            }
        });

    } catch (error) {
        console.error('Error en POST /register:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al registrar usuario' });
    }
});



//  POST /api/auth/login

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        //Validar campos

        if (!email || !password) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Email y contraseña son obligatorios'
            });
        }

        //Buscar usuario por email

        const [filas] = await pool.query(
            'SELECT * FROM usuarios WHERE email = ?', [email]
        );
        if (filas.length === 0) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Correo o contraseña incorrectos'
            });
        }

        const usuario = filas[0];

        //Verificar cuenta activa

        if (!usuario.activo) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Tu cuenta está desactivada'
            });
        }

        //Verificar contraseña
    
        let passwordCorrecta = await bcrypt.compare(password, usuario.password)
            .catch(() => false);

        if (!passwordCorrecta) {
            passwordCorrecta = (password === usuario.password);
        }

        if (!passwordCorrecta) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Correo o contraseña incorrectos'
            });
        }

        // Generar token JWT


        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, nombre: usuario.nombre_completo },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            ok: true,
            mensaje: `Bienvenido, ${usuario.nombre_completo}`,
            token,
            usuario: {
                id:              usuario.id,
                nombre_completo: usuario.nombre_completo,
                email:           usuario.email
            }
        });

    } catch (error) {
        console.error('Error en POST /login:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al iniciar sesión' });
    }
});

//  PUT /api/auth/usuarios/:id


router.put('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_completo, email, telefono, password } = req.body;

        const [filas] = await pool.query(
            'SELECT id FROM usuarios WHERE id = ?', [id]
        );
        if (filas.length === 0) {
            return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' });
        }

        let camposActualizar = { nombre_completo, email, telefono };
        if (password) {
            const salt = await bcrypt.genSalt(10);
            camposActualizar.password = await bcrypt.hash(password, salt);
        }

        Object.keys(camposActualizar).forEach(
            key => camposActualizar[key] === undefined && delete camposActualizar[key]
        );

        await pool.query('UPDATE usuarios SET ? WHERE id = ?', [camposActualizar, id]);

        res.json({ ok: true, mensaje: 'Usuario actualizado correctamente' });

    } catch (error) {
        console.error('Error en PUT /usuarios/:id:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al actualizar usuario' });
    }
});


//  DELETE /api/auth/usuarios/:id

router.delete('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [filas] = await pool.query(
            'SELECT id, nombre_completo FROM usuarios WHERE id = ?', [id]
        );
        if (filas.length === 0) {
            return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' });
        }

        await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);

        res.json({
            ok: true,
            mensaje: `Usuario "${filas[0].nombre_completo}" eliminado correctamente`
        });

    } catch (error) {
        console.error('Error en DELETE /usuarios/:id:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al eliminar usuario' });
    }
});

module.exports = router;
