import { Router } from 'express';
import {
  obtenerNotificacionesPorUsuario,
  crearNotificacion,
  marcarNotificacionLeida,
  eliminarNotificacion,
  restaurarNotificacion
} from '../controller/NotificacionController.js';

const router = Router();

// Obtener notificaciones de un usuario
router.get('/usuario/:id_usuario', obtenerNotificacionesPorUsuario);

// Crear una notificación para un usuario
router.post('/', crearNotificacion);

// Marcar notificación como leída
router.patch('/:id/leida', marcarNotificacionLeida);

// Eliminar (soft delete) una notificación
router.delete('/:id', eliminarNotificacion);

// Restaurar notificación eliminada
router.patch('/:id/restaurar', restaurarNotificacion);

export default router;
