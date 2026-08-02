import { Router } from 'express';
import {
  obtenerAsignaciones,
  crearAsignacion,
  eliminarAsignacion
} from '../controller/AutobusConductorController.js';

const router = Router();

// Listar todas las asignaciones
router.get('/', obtenerAsignaciones);

// Crear una asignación (asignar conductor a autobús)
router.post('/', crearAsignacion);

// Eliminar una asignación (soft delete)
router.delete('/:id_autobus/:id_conductor', eliminarAsignacion);

export default router;
