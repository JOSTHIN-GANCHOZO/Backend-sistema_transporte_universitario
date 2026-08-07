import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { requireRol, requireAdminPrincipal } from '../middleware/roles.js';
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
router.post('/', verifyToken, requireAdminPrincipal, crearNotificacion);

// Marcar notificación como leída
router.patch('/:id/leida', verifyToken, marcarNotificacionLeida);

// Eliminar (soft delete) una notificación
router.delete('/:id', verifyToken, requireAdminPrincipal, eliminarNotificacion);

// Restaurar notificación eliminada
router.patch('/:id/restaurar', verifyToken, requireAdminPrincipal, restaurarNotificacion);

export default router;
