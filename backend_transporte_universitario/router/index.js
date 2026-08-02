import { Router } from 'express';
import viajeRoutes from './ViajeRouter.js';
import rolRoutes from './RolRouter.js';
import permisoRoutes from './PermisoRouter.js';
import usuarioRoutes from './UsuarioRouter.js';
import credencialRoutes from './CredencialRouter.js';
import autobusRoutes from './AutobusRouter.js';
import conductorRoutes from './ConductorRouter.js';
import rutaRoutes from './RutaRouter.js';
import paradaRoutes from './ParadaRouter.js';
import reservaRoutes from './ReservaRouter.js';
import notificacionRoutes from './NotificacionRouter.js';
import mantenimientoRoutes from './MantenimientoRouter.js';
import autobusConductorRoutes from './AutobusConductorRouter.js';
import rutaParadaRoutes from './RutaParadaRouter.js';

const router = Router();

router.use('/viajes', viajeRoutes);
router.use('/roles', rolRoutes);
router.use('/permisos', permisoRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/credenciales', credencialRoutes);
router.use('/autobuses', autobusRoutes);
router.use('/conductores', conductorRoutes);
router.use('/rutas', rutaRoutes);
router.use('/paradas', paradaRoutes);
router.use('/reservas', reservaRoutes);
router.use('/notificaciones', notificacionRoutes);
router.use('/mantenimientos', mantenimientoRoutes);
router.use('/autobus-conductores', autobusConductorRoutes);
router.use('/ruta-paradas', rutaParadaRoutes);

export default router;