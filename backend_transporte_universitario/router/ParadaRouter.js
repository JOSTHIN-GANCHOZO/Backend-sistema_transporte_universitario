import { Router } from 'express';
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
router.get('/', obtenerParadas);

// Obtener una parada por ID
router.get('/:id', obtenerParadaPorId);

// Crear una nueva parada
router.post('/', crearParada);

// Actualizar una parada existente
router.put('/:id', actualizarParada);

// Eliminar (soft delete) una parada
router.delete('/:id', eliminarParada);

// Restaurar una parada eliminada lógicamente
router.patch('/:id/restaurar', restaurarParada);

export default router;
