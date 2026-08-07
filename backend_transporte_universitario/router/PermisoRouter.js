import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { requireRol, requireAdminPrincipal } from '../middleware/roles.js';
import {
  obtenerPermisos,
  obtenerPermisoPorId,
  crearPermiso,
  actualizarPermiso,
  eliminarPermiso,
  restaurarPermiso
} from '../controller/PermisoController.js';

const router = Router();

// Obtener todos los permisos
router.get('/', verifyToken, requireRol(['ADMINISTRATIVO']), obtenerPermisos);

// Obtener un permiso por ID
router.get('/:id', verifyToken, requireRol(['ADMINISTRATIVO']), obtenerPermisoPorId);

// Crear un nuevo permiso
router.post('/', verifyToken, requireAdminPrincipal, crearPermiso);

// Actualizar un permiso existente
router.put('/:id', verifyToken, requireAdminPrincipal, actualizarPermiso);

// Eliminar (soft delete) un permiso
router.delete('/:id', verifyToken, requireAdminPrincipal, eliminarPermiso);

// Restaurar un permiso eliminado lógicamente
router.patch('/:id/restaurar', verifyToken, requireAdminPrincipal, restaurarPermiso);

export default router;
