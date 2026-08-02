import { Router } from 'express';
import {
  obtenerCredencialPorUsuario,
  crearCredencial,
  actualizarPassword,
  cambiarEstadoCredencial
} from '../controller/CredencialController.js';

const router = Router();

// Obtener credencial por usuario
router.get('/usuario/:id_usuario', obtenerCredencialPorUsuario);

// Crear credencial para usuario
router.post('/', crearCredencial);

// Actualizar contraseña de credencial
router.put('/usuario/:id_usuario/password', actualizarPassword);

// Cambiar estado de credencial (ACTIVA, BLOQUEADA, INACTIVA)
router.patch('/usuario/:id_usuario/estado', cambiarEstadoCredencial);

export default router;
