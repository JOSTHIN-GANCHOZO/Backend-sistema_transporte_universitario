import express from 'express';
import cors from 'cors';
import viajeRoutes from './router/ViajeRouter.js';

const app = express();
app.use(cors());
app.use(express.json());
// ===============================
// Rutas
// ===============================
app.use('/api/viajes', viajeRoutes);
export default app;