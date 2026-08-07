import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { requireRol, requireAdminPrincipal } from '../middleware/roles.js';
import {
  obtenerCredencialPorUsuario,
  crearCredencial,
  actualizarPassword,
  cambiarEstadoCredencial
} from '../controller/CredencialController.js';

const router = Router();

// Obtener credencial por usuario
router.get('/usuario/:id_usuario', verifyToken, requireRol(['ADMINISTRATIVO']), obtenerCredencialPorUsuario);

// Crear credencial para usuario (solo admin principal)
router.post('/', verifyToken, requireAdminPrincipal, crearCredencial);

// Actualizar contraseña de credencial (usuario autenticado, incluye el cambio de contraseña inicial)
router.put('/usuario/:id_usuario/password', verifyToken, actualizarPassword);

// Cambiar estado de credencial (ACTIVA, BLOQUEADA, INACTIVA) (solo admin principal)
router.patch('/usuario/:id_usuario/estado', verifyToken, requireAdminPrincipal, cambiarEstadoCredencial);

export default router;
