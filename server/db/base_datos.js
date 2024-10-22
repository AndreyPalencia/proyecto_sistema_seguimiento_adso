const mysql = require("mysql2/promise");
require('dotenv').config();

const connectionPool = mysql.createPool({ //Configurando la conexion Base de datos
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
    
}); //Conectamos a la base de datos 

// Exportar el pool para usarlo en otros módulos
module.exports = connectionPool;
