import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { requireRol, requireAdminPrincipal } from '../middleware/roles.js';
import {
  obtenerParadas,
  obtenerParadaPorId,
  crearParada,
  actualizarParada,
  eliminarParada,
  restaurarParada
} from '../controller/ParadaController.js';

const router = Router();

// Obtener todas las paradas
router.get('/', verifyToken, obtenerParadas);

// Obtener una parada por ID
router.get('/:id', verifyToken, obtenerParadaPorId);

// Crear una nueva parada
router.post('/', verifyToken, requireAdminPrincipal, crearParada);

// Actualizar una parada existente
router.put('/:id', verifyToken, requireAdminPrincipal, actualizarParada);

// Eliminar (soft delete) una parada
router.delete('/:id', verifyToken, requireAdminPrincipal, eliminarParada);

// Restaurar una parada eliminada lógicamente
router.patch('/:id/restaurar', verifyToken, requireAdminPrincipal, restaurarParada);

export default router;
