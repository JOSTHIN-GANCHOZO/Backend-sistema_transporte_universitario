import express from 'express';
import cors from 'cors';
import viajeRoutes from './router/ViajeRouter.js';
import rolRoutes from './router/RolRouter.js';
import permisoRoutes from './router/PermisoRouter.js';
import usuarioRoutes from './router/UsuarioRouter.js';

const app = express();
app.use(cors());
app.use(express.json());
// ===============================
// Rutas
// ===============================
app.use('/api/viajes', viajeRoutes);
app.use('/api/roles', rolRoutes);
app.use('/api/permisos', permisoRoutes);
app.use('/api/usuarios', usuarioRoutes);
export default app;