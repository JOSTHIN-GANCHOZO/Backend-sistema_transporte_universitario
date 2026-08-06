import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import router from './router/index.js';

const app = express();

// Configuración de CORS para permitir solicitudes desde tu frontend
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

// Permite procesar datos en formato JSON enviados en el cuerpo de las peticiones (login)
app.use(express.json());

// Seguridad: cabeceras HTTP seguras
app.use(helmet());

// ===============================
// Rutas (router centralizado)
// ===============================
app.use('/api', router);

export default app;