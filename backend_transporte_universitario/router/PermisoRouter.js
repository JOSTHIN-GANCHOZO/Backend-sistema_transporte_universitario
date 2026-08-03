import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { requireRol } from '../middleware/roles.js';
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
router.get('/', verifyToken, obtenerPermisos);

// Obtener un permiso por ID
router.get('/:id', verifyToken, obtenerPermisoPorId);

// Crear un nuevo permiso
router.post('/', verifyToken, requireRol(['ADMINISTRADOR']), crearPermiso);

// Actualizar un permiso existente
router.put('/:id', verifyToken, requireRol(['ADMINISTRADOR']), actualizarPermiso);

// Eliminar (soft delete) un permiso
router.delete('/:id', verifyToken, requireRol(['ADMINISTRADOR']), eliminarPermiso);

// Restaurar un permiso eliminado l��gicamente
router.patch('/:id/restaurar', verifyToken, requireRol(['ADMINISTRADOR']), restaurarPermiso);

export default router;
