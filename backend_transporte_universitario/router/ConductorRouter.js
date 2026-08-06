import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { requireRol } from '../middleware/roles.js';
import {
  obtenerConductores,
  obtenerConductorPorId,
  crearConductor,
  actualizarConductor,
  eliminarConductor,
  restaurarConductor
} from '../controller/ConductorController.js';

const router = Router();

// Obtener todos los conductores
router.get('/', verifyToken, requireRol(['ADMINISTRATIVO']), obtenerConductores);

// Obtener un conductor por ID
router.get('/:id', verifyToken, requireRol(['ADMINISTRATIVO']), obtenerConductorPorId);

// Crear un nuevo conductor
router.post('/', verifyToken, requireRol(['ADMINISTRATIVO']), crearConductor);

// Actualizar un conductor existente
router.put('/:id', verifyToken, requireRol(['ADMINISTRATIVO']), actualizarConductor);

// Eliminar (soft delete) un conductor
router.delete('/:id', verifyToken, requireRol(['ADMINISTRATIVO']), eliminarConductor);

// Restaurar un conductor eliminado lógicamente
router.patch('/:id/restaurar', verifyToken, requireRol(['ADMINISTRATIVO']), restaurarConductor);

export default router;
