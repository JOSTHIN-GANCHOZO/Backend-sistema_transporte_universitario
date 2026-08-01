import { Router } from 'express';
import {
  obtenerViajes,
  obtenerViajePorId,
  crearViaje,
  actualizarEstadoViaje,
  eliminarViaje,
  restaurarViaje
} from '../controller/ViajeController.js';

const router = Router();

// Obtener todos los viajes
router.get('/', obtenerViajes);

// Obtener un viaje por ID
router.get('/:id', obtenerViajePorId);

// Crear un nuevo viaje
router.post('/', crearViaje);

// Actualizar el estado de un viaje
router.patch('/:id/estado', actualizarEstadoViaje);

// Borrado lógico de un viaje
router.delete('/:id', eliminarViaje);

// Restaurar un viaje deshabilitado
router.patch('/:id/restaurar', restaurarViaje);

export default router;
