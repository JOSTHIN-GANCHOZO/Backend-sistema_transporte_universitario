import { Router } from 'express';
import {
  obtenerRutas,
  obtenerRutaPorId,
  crearRuta,
  actualizarRuta,
  eliminarRuta,
  restaurarRuta
} from '../controller/RutaController.js';

const router = Router();

// Obtener todas las rutas
router.get('/', obtenerRutas);

// Obtener una ruta por ID
router.get('/:id', obtenerRutaPorId);

// Crear una nueva ruta
router.post('/', crearRuta);

// Actualizar una ruta existente
router.put('/:id', actualizarRuta);

// Eliminar (soft delete) una ruta
router.delete('/:id', eliminarRuta);

// Restaurar una ruta eliminada lógicamente
router.patch('/:id/restaurar', restaurarRuta);

export default router;
