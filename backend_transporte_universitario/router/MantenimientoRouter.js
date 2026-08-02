import { Router } from 'express';
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
router.get('/', obtenerMantenimientos);

// Obtener mantenimiento por ID
router.get('/:id', obtenerMantenimientoPorId);

// Crear mantenimiento
router.post('/', crearMantenimiento);

// Actualizar mantenimiento
router.put('/:id', actualizarMantenimiento);

// Eliminar (soft delete)
router.delete('/:id', eliminarMantenimiento);

// Restaurar mantenimiento
router.patch('/:id/restaurar', restaurarMantenimiento);

export default router;
