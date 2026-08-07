import bcrypt from 'bcrypt';
import { Credencial, Usuario } from '../models/index.js';
import { motivoBloqueoGestion, mensajeMotivoBloqueo } from './helpers/proteccionAdministradores.js';

export const obtenerCredencialPorUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;

    if (!id_usuario || isNaN(Number(id_usuario))) {
      return res.status(400).json({ mensaje: 'El ID de usuario proporcionado no es válido.' });
    }

    // Regla de negocio: solo el propio usuario o un administrador puede ver su credencial
    const esAdministrativo = req.user && req.user.rol === 'ADMINISTRATIVO';
    if (!esAdministrativo && Number(req.user.id_usuario) !== Number(id_usuario)) {
      return res.status(403).json({ mensaje: 'No tienes permiso para ver la credencial de otro usuario.' });
    }

    const credencial = await Credencial.findOne({
      where: { id_usuario },
      attributes: ['id_credencial', 'id_usuario', 'estado', 'ultimo_acceso']
    });

    if (!credencial) {
      return res.status(404).json({ mensaje: 'Credencial no encontrada para este usuario.' });
    }

    return res.status(200).json(credencial);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener credencial', error: error.message });
  }
};

export const crearCredencial = async (req, res) => {
  try {
    const { id_usuario, password } = req.body;
    const errores = [];

    // Validaciones de entrada en el controlador
    if (!id_usuario || isNaN(Number(id_usuario))) {
      errores.push({ campo: 'id_usuario', mensaje: 'El ID de usuario es obligatorio y debe ser un número entero.' });
    }

    if (!password || typeof password !== 'string' || !password.trim()) {
      errores.push({ campo: 'password', mensaje: 'La contraseña es obligatoria.' });
    } else if (password.trim().length < 6) {
      errores.push({ campo: 'password', mensaje: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    if (errores.length > 0) {
      return res.status(400).json({ mensaje: 'Errores de validación', errores });
    }

    // Regla de negocio: Verificar si existe el usuario
    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'El usuario especificado no existe.' });
    }

    // Regla de negocio: Unicidad (1:1)
    const credencialExistente = await Credencial.findOne({ where: { id_usuario } });
    if (credencialExistente) {
      return res.status(400).json({ mensaje: 'El usuario ya tiene una credencial registrada.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const nuevaCredencial = await Credencial.create({
      id_usuario: Number(id_usuario),
      password: passwordHash,
      estado: 'ACTIVA'
    });

    const { password: _, ...credencialSinPassword } = nuevaCredencial.toJSON();
    return res.status(201).json(credencialSinPassword);

  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al crear credencial', error: error.message });
  }
};

export const actualizarPassword = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { password } = req.body;

    if (!id_usuario || isNaN(Number(id_usuario))) {
      return res.status(400).json({ mensaje: 'El ID de usuario no es válido.' });
    }

    // Regla de negocio: solo el propio usuario o un administrador puede cambiar la contraseña
    const esAdministrativo = req.user && req.user.rol === 'ADMINISTRATIVO';
    const esElMismoUsuario = req.user && Number(req.user.id_usuario) === Number(id_usuario);

    if (!esElMismoUsuario && !esAdministrativo) {
      return res.status(403).json({ mensaje: 'No tienes permiso para cambiar la contraseña de otro usuario.' });
    }

    if (!password || typeof password !== 'string' || !password.trim()) {
      return res.status(400).json({ mensaje: 'La nueva contraseña es obligatoria.' });
    }

    if (password.trim().length < 8) {
      return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 8 caracteres.' });
    }

    if ((password.match(/\d/g) ?? []).length < 2) {
      return res.status(400).json({ mensaje: 'La contraseña debe incluir al menos 2 números.' });
    }

    if (!password.includes('.')) {
      return res.status(400).json({ mensaje: 'La contraseña debe incluir al menos un punto (.).' });
    }

    const credencial = await Credencial.findOne({ where: { id_usuario } });
    if (!credencial) {
      return res.status(404).json({ mensaje: 'Credencial no encontrada.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await credencial.update({ password: passwordHash });

    // Cuando el propio usuario cambia su contraseña, ya no debe cambiar la contraseña
    if (esElMismoUsuario) {
      await credencial.update({ debe_cambiar_password: false });
    }

    return res.status(200).json({ mensaje: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al actualizar contraseña', error: error.message });
  }
};

export const cambiarEstadoCredencial = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { estado } = req.body;

    if (!id_usuario || isNaN(Number(id_usuario))) {
      return res.status(400).json({ mensaje: 'El ID de usuario no es válido.' });
    }

    const estadosValidos = ['ACTIVA', 'BLOQUEADA', 'INACTIVA'];
    if (!estado || !estadosValidos.includes(estado)) {
      return res.status(400).json({ 
        mensaje: `Estado inválido. Valores permitidos: ${estadosValidos.join(', ')}` 
      });
    }

    const credencial = await Credencial.findOne({ where: { id_usuario } });
    if (!credencial) {
      return res.status(404).json({ mensaje: 'Credencial no encontrada.' });
    }

    // Protección: no se puede bloquear/desactivar al administrador principal, al propio o al último admin activo
    if (estado === 'BLOQUEADA' || estado === 'INACTIVA') {
      const usuario = await Usuario.findByPk(id_usuario);
      if (usuario) {
        const motivo = await motivoBloqueoGestion(usuario, req.user.id_usuario);
        if (motivo) {
          const accion = estado === 'INACTIVA' ? 'desactivar' : 'bloquear';
          return res.status(400).json({ mensaje: mensajeMotivoBloqueo(motivo, accion) });
        }
      }
    }

    await credencial.update({ estado });
    return res.status(200).json({ mensaje: `Estado de la credencial actualizado a "${estado}" correctamente.` });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al cambiar estado de la credencial', error: error.message });
  }
};