import { Router } from 'express';
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
router.get('/', obtenerConductores);

// Obtener un conductor por ID
router.get('/:id', obtenerConductorPorId);

// Crear un nuevo conductor
router.post('/', crearConductor);

// Actualizar un conductor existente
router.put('/:id', actualizarConductor);

// Eliminar (soft delete) un conductor
router.delete('/:id', eliminarConductor);

// Restaurar un conductor eliminado lógicamente
router.patch('/:id/restaurar', restaurarConductor);

export default router;
