import { Router } from 'express';
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
router.get('/', obtenerReservas);

// Obtener una reserva por ID
router.get('/:id', obtenerReservaPorId);

// Crear una nueva reserva
router.post('/', crearReserva);

// Cancelar una reserva
router.patch('/:id/cancelar', cancelarReserva);

// Marcar reserva como utilizada
router.patch('/:id/utilizar', utilizarReserva);

// Eliminar (soft delete) una reserva
router.delete('/:id', eliminarReserva);

// Restaurar una reserva eliminada lógicamente
router.patch('/:id/restaurar', restaurarReserva);

export default router;
