import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { requireRol } from '../middleware/roles.js';
import {
  obtenerAsignaciones,
  crearAsignacion,
  eliminarAsignacion
} from '../controller/AutobusConductorController.js';

const router = Router();

// Listar todas las asignaciones (solo admin)
router.get('/', verifyToken, requireRol(['ADMINISTRADOR']), obtenerAsignaciones);

// Crear una asignaci��n (asignar conductor a autobǧs) (solo admin)
router.post('/', verifyToken, requireRol(['ADMINISTRADOR']), crearAsignacion);

// Eliminar una asignaci��n (soft delete) (solo admin)
router.delete('/:id_autobus/:id_conductor', verifyToken, requireRol(['ADMINISTRADOR']), eliminarAsignacion);

export default router;
