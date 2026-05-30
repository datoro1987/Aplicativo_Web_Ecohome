// backend/server.js

const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');

dotenv.config();

const app = express();

// Middlewares

app.use(cors());
app.use(express.json());

// Rutas

const authRoutes         = require('./routes/auth');
const residuosRoutes     = require('./routes/residuos');
const estadisticasRoutes = require('./routes/estadisticas');

app.use('/api/auth',         authRoutes);
app.use('/api/residuos',     residuosRoutes);
app.use('/api/estadisticas', estadisticasRoutes);

//Ruta de bienvenida

app.get('/', (req, res) => {
    res.json({
        mensaje: '¡Bienvenido a la API de EcoHome 360!',
        status: 'running',
        version: '1.0.0',
        rutas: [
            'GET    /api/auth/usuarios            → listar usuarios',
            'GET    /api/auth/usuarios/:id        → ver usuario',
            'POST   /api/auth/register            → registrar usuario',
            'POST   /api/auth/login               → iniciar sesión',
            'PUT    /api/auth/usuarios/:id        → actualizar usuario',
            'DELETE /api/auth/usuarios/:id        → eliminar usuario',
            '───────────────────────────────────────────────',
            'GET    /api/residuos                 → listar residuos',
            'GET    /api/residuos/:id             → ver residuo',
            'POST   /api/residuos                 → registrar residuo',
            'PUT    /api/residuos/:id             → actualizar residuo',
            'DELETE /api/residuos/:id             → eliminar residuo',
            '───────────────────────────────────────────────',
            'GET    /api/estadisticas/resumen     → tarjetas de resumen',
            'GET    /api/estadisticas/por-tipo    → gráfico torta',
            'GET    /api/estadisticas/por-mes     → gráfico barras',
        ]
    });
});

// Iniciar servidor
7
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(` Servidor corriendo en http://localhost:${PORT}`);
    console.log(` Usuarios:      http://localhost:${PORT}/api/auth/usuarios`);
    console.log(` Residuos:      http://localhost:${PORT}/api/residuos`);
    console.log(`Estadísticas:  http://localhost:${PORT}/api/estadisticas/resumen`);
});