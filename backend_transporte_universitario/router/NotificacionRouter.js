import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { requireRol } from '../middleware/roles.js';
import {
  obtenerNotificacionesPorUsuario,
  crearNotificacion,
  marcarNotificacionLeida,
  eliminarNotificacion,
  restaurarNotificacion
} from '../controller/NotificacionController.js';

const router = Router();

// Obtener notificaciones de un usuario
router.get('/usuario/:id_usuario', verifyToken, obtenerNotificacionesPorUsuario);

// Crear una notificaci��n para un usuario
router.post('/', verifyToken, requireRol(['ADMINISTRADOR']), crearNotificacion);

// Marcar notificaci��n como le��da
router.patch('/:id/leida', verifyToken, marcarNotificacionLeida);

// Eliminar (soft delete) una notificaci��n
router.delete('/:id', verifyToken, requireRol(['ADMINISTRADOR']), eliminarNotificacion);

// Restaurar notificaci��n eliminada
router.patch('/:id/restaurar', verifyToken, requireRol(['ADMINISTRADOR']), restaurarNotificacion);

export default router;
