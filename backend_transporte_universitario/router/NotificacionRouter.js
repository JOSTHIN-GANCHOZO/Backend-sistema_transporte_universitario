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

// Crear una notificación para un usuario
router.post('/', verifyToken, requireRol(['ADMINISTRATIVO']), crearNotificacion);

// Marcar notificación como leída
router.patch('/:id/leida', verifyToken, marcarNotificacionLeida);

// Eliminar (soft delete) una notificación
router.delete('/:id', verifyToken, requireRol(['ADMINISTRATIVO']), eliminarNotificacion);

// Restaurar notificación eliminada
router.patch('/:id/restaurar', verifyToken, requireRol(['ADMINISTRATIVO']), restaurarNotificacion);

export default router;
