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
router.get('/', verifyToken, obtenerConductores);

// Obtener un conductor por ID
router.get('/:id', verifyToken, obtenerConductorPorId);

// Crear un nuevo conductor
router.post('/', verifyToken, requireRol(['ADMINISTRADOR']), crearConductor);

// Actualizar un conductor existente
router.put('/:id', verifyToken, requireRol(['ADMINISTRADOR']), actualizarConductor);

// Eliminar (soft delete) un conductor
router.delete('/:id', verifyToken, requireRol(['ADMINISTRADOR']), eliminarConductor);

// Restaurar un conductor eliminado lógicamente
router.patch('/:id/restaurar', verifyToken, requireRol(['ADMINISTRADOR']), restaurarConductor);

export default router;
