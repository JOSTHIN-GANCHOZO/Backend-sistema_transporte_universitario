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
router.get('/', verifyToken, obtenerMantenimientos);

// Obtener mantenimiento por ID
router.get('/:id', verifyToken, obtenerMantenimientoPorId);

// Crear mantenimiento
router.post('/', verifyToken, requireRol(['ADMINISTRADOR']), crearMantenimiento);

// Actualizar mantenimiento
router.put('/:id', verifyToken, requireRol(['ADMINISTRADOR']), actualizarMantenimiento);

// Eliminar (soft delete)
router.delete('/:id', verifyToken, requireRol(['ADMINISTRADOR']), eliminarMantenimiento);

// Restaurar mantenimiento
router.patch('/:id/restaurar', verifyToken, requireRol(['ADMINISTRADOR']), restaurarMantenimiento);

export default router;
