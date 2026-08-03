import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { requireRol } from '../middleware/roles.js';
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
router.get('/', verifyToken, obtenerViajes);

// Obtener un viaje por ID
router.get('/:id', verifyToken, obtenerViajePorId);

// Crear un nuevo viaje
router.post('/', verifyToken, requireRol(['ADMINISTRADOR']), crearViaje);

// Actualizar el estado de un viaje
router.patch('/:id/estado', verifyToken, requireRol(['ADMINISTRADOR']), actualizarEstadoViaje);

// Borrado l��gico de un viaje
router.delete('/:id', verifyToken, requireRol(['ADMINISTRADOR']), eliminarViaje);

// Restaurar un viaje deshabilitado
router.patch('/:id/restaurar', verifyToken, requireRol(['ADMINISTRADOR']), restaurarViaje);

export default router;
