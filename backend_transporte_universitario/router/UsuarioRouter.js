import { Router } from 'express';
import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  desactivarAccesoUsuario,
  activarAccesoUsuario,
  eliminarUsuario,
  restaurarUsuario
<<<<<<< HEAD
} from '../controller/UsuarioController.js';
=======
} from '../controller/UsuarioController.js'; 
>>>>>>> origin/develop

const router = Router();
// --- RUTAS PRINCIPALES (CRUD) ---
router.get('/', obtenerUsuarios);
router.get('/:id', obtenerUsuarioPorId);
router.post('/', crearUsuario);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);
// --- RUTAS DE ESTADO Y CREDENCIALES ---
router.patch('/:id/desactivar-acceso', desactivarAccesoUsuario);
router.patch('/:id/activar-acceso', activarAccesoUsuario);
router.patch('/:id/restaurar', restaurarUsuario);

export default router;