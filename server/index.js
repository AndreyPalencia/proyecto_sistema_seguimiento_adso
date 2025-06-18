import express from 'express';
import cors from 'cors'; //Permitir petiones de otras url
//Para cargar las variables de entornno en todo el servicio
import 'dotenv/config';
import cookieParser from 'cookie-parser';
//Importar las rutas de la carpeta routes para las peticiones https
import routes from './routes/index.js';
import http from 'http'; // Importamos http para usarlo con socket.io
import { Server } from 'socket.io';

import ApiResponse from './utils/apiResponse.js';
const { FRONTEND_URL, PORT } = process.env;

//Configuración de peticiones externas
const allowedOrigins = [FRONTEND_URL];

const app = express(); // Inicializamos Express
const server = http.createServer(app); // Creamos un servidor HTTP con Express

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  exposedHeaders: ['Content-Disposition'],
};

//Para convierta el body con json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Configuraicon para aceptar las cookies
app.use(cookieParser());

app.use(cors(corsOptions));

const io = new Server(server, {
  cors: corsOptions,
});

//Routas para las peticiones https
app.use('/api', routes);

// Manejo de rutas no encontradas para el back-end
app.use((req, res) => {
  ApiResponse.error(res, undefined, 'La ruta no existe.');
});

// Mapeo de usuarios conectados: { idUsuario: socket.id }
const usuariosConectados = new Map();

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('registrarUsuario', (idUsuario) => {
    usuariosConectados.set(idUsuario, socket.id);
    console.log(`Usuario ${idUsuario} registrado con socket ID ${socket.id}`);
    console.log(usuariosConectados);
  });

  // Escuchamos el evento personalizado de desconexión
  socket.on('disconnectUsuario', (idUsuario) => {
    // Eliminar el usuario del mapa de usuarios conectados
    if (usuariosConectados.has(idUsuario)) {
      usuariosConectados.delete(idUsuario);
      console.log(
        `Usuario ${idUsuario} desconectado manualmente (cerró sesión)`
      );
    }
  });

  socket.on('disconnect', () => {
    for (const [idUsuario, idSocket] of usuariosConectados.entries()) {
      if (idSocket === socket.id) {
        usuariosConectados.delete(idUsuario);
        console.log(`Usuario ${idUsuario} desconectado`);
        break;
      }
    }
  });
});

//Puerto de escucha
const PORT_UTILIZADO = PORT || 5000;

server.listen(PORT_UTILIZADO, () => {
  console.log(`Servidor corriendo en el puerto ${PORT_UTILIZADO}`);
});

export { io, usuariosConectados };
