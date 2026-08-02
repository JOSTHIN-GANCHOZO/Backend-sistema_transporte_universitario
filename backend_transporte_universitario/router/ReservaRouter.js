import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { requireRol } from '../middleware/roles.js';
import {
  obtenerReservas,
  obtenerReservaPorId,
  crearReserva,
  cancelarReserva,
  utilizarReserva,
  eliminarReserva,
  restaurarReserva
} from '../controller/ReservaController.js';

const router = Router();

// Obtener todas las reservas
router.get('/', verifyToken, obtenerReservas);

// Obtener una reserva por ID
router.get('/:id', verifyToken, obtenerReservaPorId);

// Crear una nueva reserva
router.post('/', verifyToken, crearReserva);

// Cancelar una reserva
router.patch('/:id/cancelar', verifyToken, cancelarReserva);

// Marcar reserva como utilizada
router.patch('/:id/utilizar', verifyToken, requireRol(['ADMINISTRADOR']), utilizarReserva);

// Eliminar (soft delete) una reserva
router.delete('/:id', verifyToken, requireRol(['ADMINISTRADOR']), eliminarReserva);

// Restaurar una reserva eliminada l��gicamente
router.patch('/:id/restaurar', verifyToken, requireRol(['ADMINISTRADOR']), restaurarReserva);

export default router;
