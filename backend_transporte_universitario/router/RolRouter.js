import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { requireRol, requireAdminPrincipal } from '../middleware/roles.js';
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
router.get('/', verifyToken, requireRol(['ADMINISTRATIVO']), obtenerRoles);

// Obtener un rol por ID
router.get('/:id', verifyToken, requireRol(['ADMINISTRATIVO']), obtenerRolPorId);

// Crear un nuevo rol
router.post('/', verifyToken, requireAdminPrincipal, crearRol);

// Actualizar un rol existente
router.put('/:id', verifyToken, requireAdminPrincipal, actualizarRol);

// Eliminar (soft delete) un rol
router.delete('/:id', verifyToken, requireAdminPrincipal, eliminarRol);

// Restaurar un rol eliminado lógicamente
router.patch('/:id/restaurar', verifyToken, requireAdminPrincipal, restaurarRol);

export default router;
