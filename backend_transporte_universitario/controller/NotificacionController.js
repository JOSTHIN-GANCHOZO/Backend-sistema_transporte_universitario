import { Notificacion, Usuario } from '../models/index.js';

export const obtenerNotificacionesPorUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;

    if (!id_usuario || isNaN(Number(id_usuario))) {
      return res.status(400).json({ mensaje: 'El ID de usuario no es válido.' });
    }

    // Regla de negocio: un usuario no administrador solo ve sus propias notificaciones
    const esAdministrativo = req.user && req.user.rol === 'ADMINISTRATIVO';
    if (!esAdministrativo && Number(req.user.id_usuario) !== Number(id_usuario)) {
      return res.status(403).json({ mensaje: 'No tienes permiso para ver las notificaciones de otro usuario.' });
    }

    const notificaciones = await Notificacion.findAll({
      where: { id_usuario: Number(id_usuario) },
      order: [['fecha_creacion', 'DESC']]
    });

    return res.status(200).json(notificaciones);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener notificaciones', error: error.message });
  }
};

export const crearNotificacion = async (req, res) => {
  try {
    const { id_usuario, titulo, mensaje } = req.body;
    const errores = [];

    // Validaciones en el controlador
    if (!id_usuario || isNaN(Number(id_usuario))) {
      errores.push({ campo: 'id_usuario', mensaje: 'El ID de usuario es obligatorio y debe ser un número entero.' });
    }

    if (!titulo || typeof titulo !== 'string' || !titulo.trim()) {
      errores.push({ campo: 'titulo', mensaje: 'El título de la notificación es obligatorio.' });
    }

    if (!mensaje || typeof mensaje !== 'string' || !mensaje.trim()) {
      errores.push({ campo: 'mensaje', mensaje: 'El mensaje de la notificación es obligatorio.' });
    }

    if (errores.length > 0) {
      return res.status(400).json({ mensaje: 'Errores de validación', errores });
    }

    // Comprobar existencia del usuario objetivo
    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'El usuario especificado no existe.' });
    }

    const nuevaNotificacion = await Notificacion.create({
      id_usuario: Number(id_usuario),
      titulo: titulo.trim(),
      mensaje: mensaje.trim(),
      leido: false
    });

    return res.status(201).json(nuevaNotificacion);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al crear notificación', error: error.message });
  }
};

export const marcarNotificacionLeida = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'El ID de notificación no es válido.' });
    }

    const notificacion = await Notificacion.findByPk(id);
    if (!notificacion) {
      return res.status(404).json({ mensaje: 'Notificación no encontrada.' });
    }

    // Regla de negocio: un usuario no administrador solo marca sus propias notificaciones
    const esAdministrativo = req.user && req.user.rol === 'ADMINISTRATIVO';
    if (!esAdministrativo && Number(notificacion.id_usuario) !== Number(req.user.id_usuario)) {
      return res.status(404).json({ mensaje: 'Notificación no encontrada.' });
    }

    await notificacion.update({ leido: true });
    return res.status(200).json({ mensaje: 'Notificación marcada como leída', notificacion });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al actualizar notificación', error: error.message });
  }
};

// Borrado Lógico (Soft Delete)
export const eliminarNotificacion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'El ID de notificación no es válido.' });
    }

    const notificacion = await Notificacion.findByPk(id);
    if (!notificacion) {
      return res.status(404).json({ mensaje: 'Notificación no encontrada.' });
    }

    await notificacion.destroy();
    return res.status(200).json({ mensaje: 'Notificación deshabilitada correctamente (Borrado Lógico)' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al eliminar notificación', error: error.message });
  }
};

// Restaurar Notificación Deshabilitada
export const restaurarNotificacion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'El ID de notificación no es válido.' });
    }

    const notificacion = await Notificacion.findByPk(id, { paranoid: false });
    if (!notificacion) {
      return res.status(404).json({ mensaje: 'Notificación no encontrada.' });
    }

    if (notificacion.fecha_eliminacion === null) {
      return res.status(400).json({ mensaje: 'La notificación ya se encuentra activa.' });
    }

    await notificacion.restore();
    return res.status(200).json({ mensaje: 'Notificación restaurada correctamente', notificacion });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al restaurar notificación', error: error.message });
  }
};