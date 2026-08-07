import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { requireRol, requireAdminPrincipal } from '../middleware/roles.js';
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
router.post('/', verifyToken, requireAdminPrincipal, crearViaje);

// Actualizar el estado de un viaje
router.patch('/:id/estado', verifyToken, requireAdminPrincipal, actualizarEstadoViaje);

// Borrado lógico de un viaje
router.delete('/:id', verifyToken, requireAdminPrincipal, eliminarViaje);

// Restaurar un viaje deshabilitado
router.patch('/:id/restaurar', verifyToken, requireAdminPrincipal, restaurarViaje);

export default router;
