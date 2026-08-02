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

// Obtener un autobǧs por ID
router.get('/:id', verifyToken, obtenerAutobusPorId);

// Crear un nuevo autobǧs
router.post('/', verifyToken, requireRol(['ADMINISTRADOR']), crearAutobus);

// Actualizar un autobǧs existente
router.put('/:id', verifyToken, requireRol(['ADMINISTRADOR']), actualizarAutobus);

// Eliminar (soft delete) un autobǧs
router.delete('/:id', verifyToken, requireRol(['ADMINISTRADOR']), eliminarAutobus);

// Restaurar un autobǧs eliminado l��gicamente
router.patch('/:id/restaurar', verifyToken, requireRol(['ADMINISTRADOR']), restaurarAutobus);

export default router;
