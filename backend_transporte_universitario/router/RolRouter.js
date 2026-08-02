import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { requireRol } from '../middleware/roles.js';
import {
  obtenerRoles,
  obtenerRolPorId,
  crearRol,
  actualizarRol,
  eliminarRol,
  restaurarRol
} from '../controller/RolController.js';

const router = Router();

// Obtener todos los roles
router.get('/', verifyToken, obtenerRoles);

// Obtener un rol por ID
router.get('/:id', verifyToken, obtenerRolPorId);

// Crear un nuevo rol
router.post('/', verifyToken, requireRol(['ADMINISTRADOR']), crearRol);

// Actualizar un rol existente
router.put('/:id', verifyToken, requireRol(['ADMINISTRADOR']), actualizarRol);

// Eliminar (soft delete) un rol
router.delete('/:id', verifyToken, requireRol(['ADMINISTRADOR']), eliminarRol);

// Restaurar un rol eliminado l��gicamente
router.patch('/:id/restaurar', verifyToken, requireRol(['ADMINISTRADOR']), restaurarRol);

export default router;
