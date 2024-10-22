const express = require("express");
const cors = require("cors"); //Permitir petiones de otras url
const app = express(); //Para iniciar el servidor
const routes = require('./routes/index.js');//Invoco el archivo fichas para acceder los middleware de ficha

//Para convierta el body con json
app.use(express.json());

//Configuración de peticiones externas

app.use(cors());

//Routas para las peticiones https
app.use('/', routes());

//Puerto de escucha
const PORT = 3000;

app.listen(PORT, () => {
    console.log("Conexion exitosa a la BD. Ejecutandoce por el puerto: " + PORT)
});

