import express from 'express';
import cors from 'cors';
import viajeRoutes from './router/ViajeRouter.js';
import rolRoutes from './router/RolRouter.js';

const app = express();
app.use(cors());
app.use(express.json());
// ===============================
// Rutas
// ===============================
app.use('/api/viajes', viajeRoutes);
app.use('/api/roles', rolRoutes);
export default app;