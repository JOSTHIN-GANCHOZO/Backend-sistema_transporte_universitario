import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { requireRol } from '../middleware/roles.js';
import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  desactivarAccesoUsuario,
  activarAccesoUsuario,
  eliminarUsuario,
  restaurarUsuario
} from '../controller/UsuarioController.js';

const router = Router();
// --- RUTAS PRINCIPALES (CRUD) ---
router.get('/', verifyToken, requireRol(['ADMINISTRATIVO']), obtenerUsuarios);
router.get('/:id', verifyToken, requireRol(['ADMINISTRATIVO']), obtenerUsuarioPorId);
router.post('/', verifyToken, requireRol(['ADMINISTRATIVO']), crearUsuario);
router.put('/:id', verifyToken, requireRol(['ADMINISTRATIVO']), actualizarUsuario);
router.delete('/:id', verifyToken, requireRol(['ADMINISTRATIVO']), eliminarUsuario);
// --- RUTAS DE ESTADO Y CREDENCIALES ---
router.patch('/:id/desactivar-acceso', verifyToken, requireRol(['ADMINISTRATIVO']), desactivarAccesoUsuario);
router.patch('/:id/activar-acceso', verifyToken, requireRol(['ADMINISTRATIVO']), activarAccesoUsuario);
router.patch('/:id/restaurar', verifyToken, requireRol(['ADMINISTRATIVO']), restaurarUsuario);

export default router;