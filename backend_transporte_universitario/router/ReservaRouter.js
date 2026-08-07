import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { requireRol, requireAdminPrincipal } from '../middleware/roles.js';
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
router.patch('/:id/utilizar', verifyToken, requireAdminPrincipal, utilizarReserva);

// Eliminar (soft delete) una reserva
router.delete('/:id', verifyToken, requireAdminPrincipal, eliminarReserva);

// Restaurar una reserva eliminada lógicamente
router.patch('/:id/restaurar', verifyToken, requireAdminPrincipal, restaurarReserva);

export default router;
