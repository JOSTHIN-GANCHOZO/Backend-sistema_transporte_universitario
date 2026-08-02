import { Router } from 'express';
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
router.get('/', obtenerPermisos);

// Obtener un permiso por ID
router.get('/:id', obtenerPermisoPorId);

// Crear un nuevo permiso
router.post('/', crearPermiso);

// Actualizar un permiso existente
router.put('/:id', actualizarPermiso);

// Eliminar (soft delete) un permiso
router.delete('/:id', eliminarPermiso);

// Restaurar un permiso eliminado lógicamente
router.patch('/:id/restaurar', restaurarPermiso);

export default router;
