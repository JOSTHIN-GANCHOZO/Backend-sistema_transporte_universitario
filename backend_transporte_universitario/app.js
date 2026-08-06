import express from 'express';
import cors from 'cors';
import router from './router/index.js';

const app = express();

// Seguridad: cabeceras HTTP seguras
app.use(helmet());

// ===============================
// Rutas (router centralizado)
// ===============================
app.use('/api', router);
export default app;
