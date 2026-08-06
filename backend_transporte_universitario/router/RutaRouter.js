import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { requireRol } from '../middleware/roles.js';
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
router.get('/', verifyToken, obtenerRutas);

// Obtener una ruta por ID
router.get('/:id', verifyToken, obtenerRutaPorId);

// Crear una nueva ruta
router.post('/', verifyToken, requireRol(['ADMINISTRATIVO']), crearRuta);

// Actualizar una ruta existente
router.put('/:id', verifyToken, requireRol(['ADMINISTRATIVO']), actualizarRuta);

// Eliminar (soft delete) una ruta
router.delete('/:id', verifyToken, requireRol(['ADMINISTRATIVO']), eliminarRuta);

// Restaurar una ruta eliminada lógicamente
router.patch('/:id/restaurar', verifyToken, requireRol(['ADMINISTRATIVO']), restaurarRuta);

export default router;
