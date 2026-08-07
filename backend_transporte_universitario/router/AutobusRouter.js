import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { requireRol, requireAdminPrincipal } from '../middleware/roles.js';
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
router.post('/', verifyToken, requireAdminPrincipal, crearAutobus);

// Actualizar un autobús existente
router.put('/:id', verifyToken, requireAdminPrincipal, actualizarAutobus);

// Eliminar (soft delete) un autobús
router.delete('/:id', verifyToken, requireAdminPrincipal, eliminarAutobus);

// Restaurar un autobús eliminado lógicamente
router.patch('/:id/restaurar', verifyToken, requireAdminPrincipal, restaurarAutobus);

export default router;
