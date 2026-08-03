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
router.get('/', verifyToken, obtenerAutobuses);

// Obtener un autobús por ID
router.get('/:id', verifyToken, obtenerAutobusPorId);

// Crear un nuevo autobús
router.post('/', verifyToken, requireRol(['ADMINISTRADOR']), crearAutobus);

// Actualizar un autobús existente
router.put('/:id', verifyToken, requireRol(['ADMINISTRADOR']), actualizarAutobus);

// Eliminar (soft delete) un autobús
router.delete('/:id', verifyToken, requireRol(['ADMINISTRADOR']), eliminarAutobus);

// Restaurar un autobús eliminado lógicamente
router.patch('/:id/restaurar', verifyToken, requireRol(['ADMINISTRADOR']), restaurarAutobus);

export default router;
