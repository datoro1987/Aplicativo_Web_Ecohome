// backend/config/db.js

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ecohome360',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Probarconexión

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Conexión a MySQL exitosa - Base de datos: ecohome360');
        connection.release();
    } catch (error) {
        console.error('Error al conectar a MySQL:', error.message);
        console.error(' Verifica que:');
        console.error('   1. MySQL esté corriendo ');
        console.error('   2. La base de datos "ecohome360" exista');
        console.error('   3. La contraseña en .env sea correcta');
    }
}

testConnection();

module.exports = pool;