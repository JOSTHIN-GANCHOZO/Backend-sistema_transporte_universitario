import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { requireRol } from '../middleware/roles.js';
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
router.post('/', verifyToken, requireRol(['ADMINISTRATIVO']), crearParada);

// Actualizar una parada existente
router.put('/:id', verifyToken, requireRol(['ADMINISTRATIVO']), actualizarParada);

// Eliminar (soft delete) una parada
router.delete('/:id', verifyToken, requireRol(['ADMINISTRATIVO']), eliminarParada);

// Restaurar una parada eliminada lógicamente
router.patch('/:id/restaurar', verifyToken, requireRol(['ADMINISTRATIVO']), restaurarParada);

export default router;
