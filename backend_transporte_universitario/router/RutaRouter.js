import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { requireRol, requireAdminPrincipal } from '../middleware/roles.js';
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
router.post('/', verifyToken, requireAdminPrincipal, crearRuta);

// Actualizar una ruta existente
router.put('/:id', verifyToken, requireAdminPrincipal, actualizarRuta);

// Eliminar (soft delete) una ruta
router.delete('/:id', verifyToken, requireAdminPrincipal, eliminarRuta);

// Restaurar una ruta eliminada lógicamente
router.patch('/:id/restaurar', verifyToken, requireAdminPrincipal, restaurarRuta);

export default router;
