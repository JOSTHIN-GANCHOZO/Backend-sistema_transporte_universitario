import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { requireRol, requireAdminPrincipal } from '../middleware/roles.js';
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
router.post('/', verifyToken, requireAdminPrincipal, crearUsuario);
router.put('/:id', verifyToken, requireAdminPrincipal, actualizarUsuario);
router.delete('/:id', verifyToken, requireAdminPrincipal, eliminarUsuario);
// --- RUTAS DE ESTADO Y CREDENCIALES ---
router.patch('/:id/desactivar-acceso', verifyToken, requireAdminPrincipal, desactivarAccesoUsuario);
router.patch('/:id/activar-acceso', verifyToken, requireAdminPrincipal, activarAccesoUsuario);
router.patch('/:id/restaurar', verifyToken, requireAdminPrincipal, restaurarUsuario);

export default router;