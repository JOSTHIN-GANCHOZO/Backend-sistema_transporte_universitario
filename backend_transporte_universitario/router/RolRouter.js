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

router.get('/', obtenerRoles);
router.get('/:id', obtenerRolPorId);
router.post('/', crearRol);
router.put('/:id', actualizarRol);
router.delete('/:id', eliminarRol);
router.patch('/:id/restaurar', restaurarRol);

export default router;
