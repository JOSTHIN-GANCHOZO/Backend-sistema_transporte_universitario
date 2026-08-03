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
router.get('/', verifyToken, requireRol(['ADMINISTRADOR']), obtenerUsuarios);
router.get('/:id', verifyToken, requireRol(['ADMINISTRADOR']), obtenerUsuarioPorId);
router.post('/', verifyToken, requireRol(['ADMINISTRADOR']), crearUsuario);
router.put('/:id', verifyToken, requireRol(['ADMINISTRADOR']), actualizarUsuario);
router.delete('/:id', verifyToken, requireRol(['ADMINISTRADOR']), eliminarUsuario);
// --- RUTAS DE ESTADO Y CREDENCIALES ---
router.patch('/:id/desactivar-acceso', verifyToken, requireRol(['ADMINISTRADOR']), desactivarAccesoUsuario);
router.patch('/:id/activar-acceso', verifyToken, requireRol(['ADMINISTRADOR']), activarAccesoUsuario);
router.patch('/:id/restaurar', verifyToken, requireRol(['ADMINISTRADOR']), restaurarUsuario);

export default router;