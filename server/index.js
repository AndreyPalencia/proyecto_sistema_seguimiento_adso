import express from 'express';
import cors from 'cors'; //Permitir petiones de otras url
//Para cargar las variables de entornno en todo el servicio
import 'dotenv/config';
import cookieParser from 'cookie-parser';
//Importar las rutas de la carpeta routes para las peticiones https
import routes from './routes/index.js';

import ApiResponse from './utils/apiResponse.js';

const app = express(); //Inicializar el servidor

//Para convierta el body con json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Configuraicon para aceptar las cookies
app.use(cookieParser());

//Configuración de peticiones externas
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    //credentials: true, // Permite el envío de cookies en las peticiones
  })
); 

//Routas para las peticiones https
app.use('/api', routes);

// Manejo de rutas no encontradas para el back-end
app.use((req, res) => {
  ApiResponse.error(res,undefined, 'La ruta no existe.');
}); 

//Puerto de escucha
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});