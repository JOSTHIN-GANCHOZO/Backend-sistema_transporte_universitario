import { Router } from 'express';
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
router.get('/', obtenerRoles);

// Obtener un rol por ID
router.get('/:id', obtenerRolPorId);

// Crear un nuevo rol
router.post('/', crearRol);

// Actualizar un rol existente
router.put('/:id', actualizarRol);

// Eliminar (soft delete) un rol
router.delete('/:id', eliminarRol);

// Restaurar un rol eliminado lógicamente
router.patch('/:id/restaurar', restaurarRol);

export default router;
