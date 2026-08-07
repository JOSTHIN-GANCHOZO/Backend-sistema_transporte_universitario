import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { requireRol, requireAdminPrincipal } from '../middleware/roles.js';
import {
  obtenerAsignaciones,
  crearAsignacion,
  eliminarAsignacion
} from '../controller/AutobusConductorController.js';

const router = Router();

// Listar todas las asignaciones (solo admin)
router.get('/', verifyToken, requireRol(['ADMINISTRATIVO']), obtenerAsignaciones);

// Crear una asignación (asignar conductor a autobús) (solo admin principal)
router.post('/', verifyToken, requireAdminPrincipal, crearAsignacion);

// Eliminar una asignación (soft delete) (solo admin principal)
router.delete('/:id_autobus/:id_conductor', verifyToken, requireAdminPrincipal, eliminarAsignacion);

export default router;
