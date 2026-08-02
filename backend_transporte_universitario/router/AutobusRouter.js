import { Router } from 'express';
import {
  obtenerAutobuses,
  obtenerAutobusPorId,
  crearAutobus,
  actualizarAutobus,
  eliminarAutobus,
  restaurarAutobus
} from '../controller/AutobusController.js';

const router = Router();

// Obtener todos los autobuses
router.get('/', obtenerAutobuses);

// Obtener un autobús por ID
router.get('/:id', obtenerAutobusPorId);

// Crear un nuevo autobús
router.post('/', crearAutobus);

// Actualizar un autobús existente
router.put('/:id', actualizarAutobus);

// Eliminar (soft delete) un autobús
router.delete('/:id', eliminarAutobus);

// Restaurar un autobús eliminado lógicamente
router.patch('/:id/restaurar', restaurarAutobus);

export default router;
