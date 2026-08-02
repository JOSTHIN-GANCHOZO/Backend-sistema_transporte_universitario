import express from 'express';
import cors from 'cors';
import viajeRoutes from './router/ViajeRouter.js';
import rolRoutes from './router/RolRouter.js';
import permisoRoutes from './router/PermisoRouter.js';
import usuarioRoutes from './router/UsuarioRouter.js';
import credencialRoutes from './router/CredencialRouter.js';
import autobusRoutes from './router/AutobusRouter.js';
import conductorRoutes from './router/ConductorRouter.js';
import rutaRoutes from './router/RutaRouter.js';

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
app.use('/api/credenciales', credencialRoutes);
app.use('/api/autobuses', autobusRoutes);
app.use('/api/conductores', conductorRoutes);
app.use('/api/rutas', rutaRoutes);
export default app;