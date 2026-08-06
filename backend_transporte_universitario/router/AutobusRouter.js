import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { requireRol } from '../middleware/roles.js';
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
router.get('/', verifyToken, requireRol(['ADMINISTRATIVO']), obtenerAutobuses);

// Obtener un autobús por ID
router.get('/:id', verifyToken, requireRol(['ADMINISTRATIVO']), obtenerAutobusPorId);

// Crear un nuevo autobús
router.post('/', verifyToken, requireRol(['ADMINISTRATIVO']), crearAutobus);

// Actualizar un autobús existente
router.put('/:id', verifyToken, requireRol(['ADMINISTRATIVO']), actualizarAutobus);

// Eliminar (soft delete) un autobús
router.delete('/:id', verifyToken, requireRol(['ADMINISTRATIVO']), eliminarAutobus);

// Restaurar un autobús eliminado lógicamente
router.patch('/:id/restaurar', verifyToken, requireRol(['ADMINISTRATIVO']), restaurarAutobus);

export default router;
