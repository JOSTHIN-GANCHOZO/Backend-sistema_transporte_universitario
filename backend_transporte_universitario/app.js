import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
// ===============================
// Rutas
// ===============================
// app.use('/api/usuarios', usuarioRoutes);
export default app;