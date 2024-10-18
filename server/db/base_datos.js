const mysql = require("mysql2");

const baseDatos = mysql.createConnection({ //Configurando la conexion Base de datos
    host: 'localhost',
    user: 'root',
    password: 'Contraseña',
    database: 'sistema_seguimiento'
});

connection.connect((error) => {
    if(error) {
        console.error("Error al conectarse a la base de datos. " + error.stack); //Si ocurre un error stack dara informacion que falllo antes del error
        return;
    }
    return console.log("Conectado a la base de datos. ");
}); //Conectamos a la base de datos 

module.exports = connection;