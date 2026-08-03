import { Usuario, Rol, Credencial, sequelize } from '../models/index.js';

export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      include: [
        { model: Rol, attributes: ['id_rol', 'nombre'] },
        { model: Credencial, attributes: ['id_credencial', 'estado', 'ultimo_acceso'] }
      ]
    });
    return res.status(200).json(usuarios);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
  }
};

export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
    }

    const usuario = await Usuario.findByPk(id, {
      include: [
        { model: Rol, attributes: ['id_rol', 'nombre'] },
        { model: Credencial, attributes: ['id_credencial', 'estado', 'ultimo_acceso'] }
      ]
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }
    return res.status(200).json(usuario);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener usuario', error: error.message });
  }
};

export const crearUsuario = async (req, res) => {
  try {
    const { identificacion, nombres, apellidos, correo, telefono, tipo_usuario, id_rol } = req.body;
    const errores = [];

    // --- VALIDACIONES DE ENTRADA ---
    if (!identificacion || typeof identificacion !== 'string' || !identificacion.trim()) {
      errores.push({ campo: 'identificacion', mensaje: 'La identificación es obligatoria.' });
    }
    if (!nombres || typeof nombres !== 'string' || !nombres.trim()) {
      errores.push({ campo: 'nombres', mensaje: 'El nombre es obligatorio.' });
    }
    if (!apellidos || typeof apellidos !== 'string' || !apellidos.trim()) {
      errores.push({ campo: 'apellidos', mensaje: 'El apellido es obligatorio.' });
    }
    if (!correo || typeof correo !== 'string' || !correo.trim()) {
      errores.push({ campo: 'correo', mensaje: 'El correo electrónico es obligatorio.' });
    }

    const tiposPermitidos = ['ESTUDIANTE', 'DOCENTE', 'ADMINISTRATIVO'];
    if (!tipo_usuario || !tiposPermitidos.includes(tipo_usuario)) {
      errores.push({ 
        campo: 'tipo_usuario', 
        mensaje: `El tipo de usuario debe ser uno de los siguientes: ${tiposPermitidos.join(', ')}` 
      });
    }

    if (!id_rol || isNaN(Number(id_rol))) {
      errores.push({ campo: 'id_rol', mensaje: 'El ID de rol es obligatorio y debe ser numérico.' });
    }

    if (errores.length > 0) {
      return res.status(400).json({ mensaje: 'Errores de validación', errores });
    }

    // Comprobar existencia del Rol
    const rolExiste = await Rol.findByPk(id_rol);
    if (!rolExiste) {
      return res.status(400).json({ mensaje: 'El ID de rol especificado no existe.' });
    }

    const identificacionLimpia = identificacion.trim();
    const correoLimpio = correo.trim().toLowerCase();

    // Verificación previa de duplicados
    const usuarioExistente = await Usuario.findOne({
      where: {
        [sequelize.Sequelize.Op.or]: [
          { identificacion: identificacionLimpia },
          { correo: correoLimpio }
        ]
      }
    });

    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'La identificación o el correo ya se encuentran registrados.' });
    }

    const nuevoUsuario = await Usuario.create({
      identificacion: identificacionLimpia,
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      correo: correoLimpio,
      telefono: telefono ? telefono.trim() : null,
      tipo_usuario,
      id_rol: Number(id_rol)
    });

    return res.status(201).json(nuevoUsuario);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ mensaje: 'La identificación o el correo ya se encuentran registrados.' });
    }
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ mensaje: 'Error de validación en los campos enviados.', detalles: error.errors.map(e => e.message) });
    }
    return res.status(500).json({ mensaje: 'Error al crear usuario', error: error.message });
  }
};

export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
    }

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    if (req.body.tipo_usuario) {
      const tiposPermitidos = ['ESTUDIANTE', 'DOCENTE', 'ADMINISTRATIVO'];
      if (!tiposPermitidos.includes(req.body.tipo_usuario)) {
        return res.status(400).json({ 
          mensaje: `El tipo_usuario debe ser uno de los siguientes: ${tiposPermitidos.join(', ')}` 
        });
      }
    }

    if (req.body.id_rol) {
      if (isNaN(Number(req.body.id_rol))) {
        return res.status(400).json({ mensaje: 'El ID de rol debe ser un valor numérico.' });
      }
      const rolExiste = await Rol.findByPk(req.body.id_rol);
      if (!rolExiste) {
        return res.status(400).json({ mensaje: 'El ID de rol especificado no existe.' });
      }
    }

    // Formatting payloads
    delete req.body.id_usuario;
    if (req.body.identificacion) req.body.identificacion = req.body.identificacion.trim();
    if (req.body.nombres) req.body.nombres = req.body.nombres.trim();
    if (req.body.apellidos) req.body.apellidos = req.body.apellidos.trim();
    if (req.body.correo) req.body.correo = req.body.correo.trim().toLowerCase();
    if (req.body.telefono) req.body.telefono = req.body.telefono.trim();

    await usuario.update(req.body);
    return res.status(200).json(usuario);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ mensaje: 'La identificación o el correo ya se encuentran registrados.' });
    }
    return res.status(500).json({ mensaje: 'Error al actualizar usuario', error: error.message });
  }
};

// Desactivar el acceso de un usuario cambiando su credencial
export const desactivarAccesoUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
    }

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    const credencial = await Credencial.findOne({ where: { id_usuario: id } });
    if (!credencial) {
      return res.status(404).json({ mensaje: 'El usuario no tiene una credencial asociada para desactivar.' });
    }

    await credencial.update({ estado: 'INACTIVA' });

    return res.status(200).json({ 
      mensaje: 'Acceso de usuario desactivado correctamente. La credencial ha sido marcada como INACTIVA.',
      usuario
    });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al desactivar el acceso del usuario', error: error.message });
  }
};

// Reactivar el acceso de un usuario
export const activarAccesoUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
    }

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    const credencial = await Credencial.findOne({ where: { id_usuario: id } });
    if (!credencial) {
      return res.status(404).json({ mensaje: 'El usuario no tiene una credencial asociada para activar.' });
    }

    await credencial.update({ estado: 'ACTIVA' });

    return res.status(200).json({ 
      mensaje: 'Acceso de usuario reactivado correctamente. La credencial ha sido marcada como ACTIVA.',
      usuario
    });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al activar el acceso del usuario', error: error.message });
  }
};

// Borrado Lógico del Usuario (Soft Delete)
export const eliminarUsuario = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      await transaction.rollback();
      return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
    }

    const usuario = await Usuario.findByPk(id, { transaction });
    if (!usuario) {
      await transaction.rollback();
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    // Inactivar credenciales asociadas en la misma transacción si existen
    const credencial = await Credencial.findOne({ where: { id_usuario: id }, transaction });
    if (credencial) {
      await credencial.update({ estado: 'INACTIVA' }, { transaction });
    }

    await usuario.destroy({ transaction });

    await transaction.commit();
    return res.status(200).json({ mensaje: 'Usuario deshabilitado correctamente (Borrado Lógico).' });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ mensaje: 'Error al deshabilitar usuario', error: error.message });
  }
};

// Restaurar Usuario Deshabilitado
export const restaurarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
    }

    const usuario = await Usuario.findByPk(id, { paranoid: false });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    if (usuario.fecha_eliminacion === null) {
      return res.status(400).json({ mensaje: 'El usuario ya se encuentra activo.' });
    }

    await usuario.restore();

    // Reactivar la credencial asociada junto con el usuario
    const credencial = await Credencial.findOne({ where: { id_usuario: id } });
    if (credencial) {
      await credencial.update({ estado: 'ACTIVA' });
    }

    return res.status(200).json({ mensaje: 'Usuario restaurado correctamente', usuario });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al restaurar usuario', error: error.message });
  }
};