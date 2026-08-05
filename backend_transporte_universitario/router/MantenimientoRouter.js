import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { requireRol } from '../middleware/roles.js';
import {
  obtenerMantenimientos,
  obtenerMantenimientoPorId,
  crearMantenimiento,
  actualizarMantenimiento,
  eliminarMantenimiento,
  restaurarMantenimiento
} from '../controller/MantenimientoController.js';

const router = Router();

// Obtener todos los mantenimientos
router.get('/', verifyToken, requireRol(['ADMINISTRATIVO']), obtenerMantenimientos);

// Obtener mantenimiento por ID
router.get('/:id', verifyToken, requireRol(['ADMINISTRATIVO']), obtenerMantenimientoPorId);

// Crear mantenimiento
router.post('/', verifyToken, requireRol(['ADMINISTRATIVO']), crearMantenimiento);

// Actualizar mantenimiento
router.put('/:id', verifyToken, requireRol(['ADMINISTRATIVO']), actualizarMantenimiento);

// Eliminar (soft delete)
router.delete('/:id', verifyToken, requireRol(['ADMINISTRATIVO']), eliminarMantenimiento);

// Restaurar mantenimiento
router.patch('/:id/restaurar', verifyToken, requireRol(['ADMINISTRATIVO']), restaurarMantenimiento);

export default router;
