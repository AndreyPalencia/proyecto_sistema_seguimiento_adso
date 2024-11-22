require('dotenv').config(); //Para cargar las variables de entornno en todo el servicio
const express = require("express");
const cors = require("cors"); //Permitir petiones de otras url
const app = express(); //Para iniciar el servidor
const routes = require('./routes/index.js');//Invoco el archivo fichas para acceder los middleware de ficha

//Para convierta el body con json
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Configuración de peticiones externas
app.use(cors()); //Falta configurar cors para el servidor

//Routas para las peticiones https
app.use('/api', routes);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

//Puerto de escucha
const PORT = 3000 || 5000;

app.listen(PORT, () => {
    console.log("Conexion exitosa a la BD. Ejecutandoce por el puerto: " + PORT)
});