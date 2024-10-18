const express = require("express");
const cors = require("cors"); //Permitir petiones de otras url
const app = express(); //Para iniciar el servidor



app.use(express.json()); //Para convierta el body con json

app.use(cors());//Configuración de peticiones externas

app.use('/', (req,res) => {
    return res.json('Hola');
})

const PORT = 3000;

app.listen(PORT, () => {
    console.log("Conexion exitosa a la BD. Ejecutandoce por el puerto: " + PORT)
});

