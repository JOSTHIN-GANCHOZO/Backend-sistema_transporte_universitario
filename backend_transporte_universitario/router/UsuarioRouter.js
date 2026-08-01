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
} from '../controllers/usuario.controller.js'; // Ajusta la ruta según tu estructura de carpetas

const router = Router();

// --- RUTAS PRINCIPALES (CRUD) ---

// GET /api/usuarios - Obtener todos los usuarios
router.get('/', obtenerUsuarios);

// GET /api/usuarios/:id - Obtener un usuario por ID
router.get('/:id', obtenerUsuarioPorId);

// POST /api/usuarios - Crear un nuevo usuario
router.post('/', crearUsuario);

// PUT /api/usuarios/:id - Actualizar datos de un usuario
router.put('/:id', actualizarUsuario);

// DELETE /api/usuarios/:id - Borrado lógico (Soft delete) del usuario
router.delete('/:id', eliminarUsuario);


// --- RUTAS DE ESTADO Y CREDENCIALES ---

// PATCH /api/usuarios/:id/desactivar-acceso - Desactivar la credencial del usuario
router.patch('/:id/desactivar-acceso', desactivarAccesoUsuario);

// PATCH /api/usuarios/:id/activar-acceso - Reactivar la credencial del usuario
router.patch('/:id/activar-acceso', activarAccesoUsuario);

// PATCH /api/usuarios/:id/restaurar - Restaurar usuario eliminado lógicamente
router.patch('/:id/restaurar', restaurarUsuario);

export default router;