import express from 'express';
import cors from 'cors';
import router from './router/index.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);
// ===============================
// Rutas
// ===============================
// app.use('/api/usuarios', usuarioRoutes);
export default app;