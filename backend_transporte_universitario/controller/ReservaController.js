import { Reserva, Viaje, Usuario, Autobus, sequelize } from '../models/index.js';

export const obtenerReservas = async (req, res) => {
  try {
    // Regla de negocio: un usuario no administrador solo ve sus propias reservas
    const esAdministrativo = req.user && req.user.rol === 'ADMINISTRATIVO';
    const where = esAdministrativo ? {} : { id_usuario: req.user.id_usuario };

    const reservas = await Reserva.findAll({
      where,
      include: [
        { model: Usuario, attributes: ['id_usuario', 'identificacion', 'nombres', 'apellidos', 'correo'] },
        { model: Viaje, attributes: ['id_viaje', 'fecha', 'hora_salida', 'estado', 'cupos_disponibles'] }
      ]
    });
    return res.status(200).json(reservas);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener reservas', error: error.message });
  }
};

export const obtenerReservaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
    }

    const reserva = await Reserva.findByPk(id, {
      include: [{ model: Usuario }, { model: Viaje }]
    });

    if (!reserva) {
      return res.status(404).json({ mensaje: 'Reserva no encontrada.' });
    }

    // Regla de negocio: un usuario no administrador solo accede a sus propias reservas
    const esAdministrativo = req.user && req.user.rol === 'ADMINISTRATIVO';
    if (!esAdministrativo && Number(reserva.id_usuario) !== Number(req.user.id_usuario)) {
      return res.status(404).json({ mensaje: 'Reserva no encontrada.' });
    }
    return res.status(200).json(reserva);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener reserva', error: error.message });
  }
};

export const crearReserva = async (req, res) => {
  // Regla de negocio: un usuario no administrador solo puede reservar para sí mismo
  const esAdministrativo = req.user && req.user.rol === 'ADMINISTRATIVO';
  const id_usuario = (esAdministrativo && req.body.id_usuario) ? req.body.id_usuario : req.user?.id_usuario;
  const { id_viaje, numero_asiento } = req.body;
  const errores = [];

  // --- VALIDACIÓN DE PARÁMETROS ---
  if (!id_usuario || isNaN(Number(id_usuario))) {
    errores.push({ campo: 'id_usuario', mensaje: 'El ID de usuario es obligatorio.' });
  }

  if (!id_viaje || isNaN(Number(id_viaje))) {
    errores.push({ campo: 'id_viaje', mensaje: 'El ID de viaje es obligatorio.' });
  }

  if (!numero_asiento || isNaN(Number(numero_asiento)) || Number(numero_asiento) <= 0) {
    errores.push({ campo: 'numero_asiento', mensaje: 'El número de asiento debe ser un entero positivo.' });
  }

  if (errores.length > 0) {
    return res.status(400).json({ mensaje: 'Errores de validación', errores });
  }

  // --- INICIO DE TRANSACCIÓN ---
  const transaction = await sequelize.transaction();
  try {
    // 1. Verificar que el usuario existe
    const usuario = await Usuario.findByPk(id_usuario, { transaction });
    if (!usuario) {
      await transaction.rollback();
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    // 2. Obtener el Viaje con BLOQUEO de fila
    const viaje = await Viaje.findByPk(id_viaje, {
      lock: transaction.LOCK.UPDATE,
      transaction
    });

    if (!viaje) {
      await transaction.rollback();
      return res.status(404).json({ mensaje: 'El viaje especificado no existe.' });
    }

    // 3. El viaje debe estar en estado PROGRAMADO
    if (viaje.estado !== 'PROGRAMADO') {
      await transaction.rollback();
      return res.status(400).json({ mensaje: `No se pueden crear reservas en un viaje con estado: ${viaje.estado}.` });
    }

    // 4. Control de cupos
    if (viaje.cupos_disponibles <= 0) {
      await transaction.rollback();
      return res.status(400).json({ mensaje: 'No hay cupos disponibles para este viaje.' });
    }

    // 4b. Validar que el número de asiento no exceda la capacidad del autobús
    const autobus = await Autobus.findByPk(viaje.id_autobus, { transaction });
    if (autobus && Number(numero_asiento) > autobus.capacidad_maxima) {
      await transaction.rollback();
      return res.status(400).json({
        mensaje: `El número de asiento no puede ser mayor a la capacidad del autobús (${autobus.capacidad_maxima}).`
      });
    }

    // 5. Máximo 1 reserva activa por usuario en el mismo viaje
    const reservaUsuarioExistente = await Reserva.findOne({
      where: {
        id_usuario,
        id_viaje,
        estado: ['PENDIENTE', 'CONFIRMADA']
      },
      transaction
    });

    if (reservaUsuarioExistente) {
      await transaction.rollback();
      return res.status(400).json({ mensaje: 'El usuario ya cuenta con una reserva activa para este viaje.' });
    }

    // 6. Validar que el asiento no esté ocupado
    const asientoOcupado = await Reserva.findOne({
      where: {
        id_viaje,
        numero_asiento: Number(numero_asiento),
        estado: ['PENDIENTE', 'CONFIRMADA']
      },
      transaction
    });

    if (asientoOcupado) {
      await transaction.rollback();
      return res.status(400).json({ mensaje: `El asiento número ${numero_asiento} ya está reservado en este viaje.` });
    }

    // 7. Crear la reserva
    const nuevaReserva = await Reserva.create({
      fecha: new Date(),
      numero_asiento: Number(numero_asiento),
      estado: 'CONFIRMADA',
      id_usuario: Number(id_usuario),
      id_viaje: Number(id_viaje)
    }, { transaction });

    // 8. Restar 1 al cupo del viaje
    await viaje.decrement('cupos_disponibles', { by: 1, transaction });

    await transaction.commit();

    return res.status(201).json({
      mensaje: 'Reserva creada y confirmada exitosamente.',
      reserva: nuevaReserva
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ mensaje: 'Error al procesar la reserva', error: error.message });
  }
};

export const cancelarReserva = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
  }

  const transaction = await sequelize.transaction();
  try {
    const reserva = await Reserva.findByPk(id, {
      lock: transaction.LOCK.UPDATE,
      transaction
    });

    if (!reserva) {
      await transaction.rollback();
      return res.status(404).json({ mensaje: 'Reserva no encontrada.' });
    }

    // Regla de negocio: un usuario no administrador solo cancela sus propias reservas
    const esAdministrativo = req.user && req.user.rol === 'ADMINISTRATIVO';
    if (!esAdministrativo && Number(reserva.id_usuario) !== Number(req.user.id_usuario)) {
      await transaction.rollback();
      return res.status(404).json({ mensaje: 'Reserva no encontrada.' });
    }

    if (reserva.estado === 'CANCELADA') {
      await transaction.rollback();
      return res.status(400).json({ mensaje: 'La reserva ya se encuentra cancelada.' });
    }

    if (reserva.estado === 'UTILIZADA') {
      await transaction.rollback();
      return res.status(400).json({ mensaje: 'No se puede cancelar una reserva que ya fue utilizada.' });
    }

    // Cambiar estado a CANCELADA
    await reserva.update({ estado: 'CANCELADA' }, { transaction });

    // Devolver cupo al viaje
    const viaje = await Viaje.findByPk(reserva.id_viaje, { transaction });
    if (viaje) {
      await viaje.increment('cupos_disponibles', { by: 1, transaction });
    }

    await transaction.commit();
    return res.status(200).json({
      mensaje: 'Reserva cancelada correctamente. El cupo ha sido devuelto al viaje.',
      reserva
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ mensaje: 'Error al cancelar la reserva', error: error.message });
  }
};

// Marcar reserva como UTILIZADA al abordar
export const utilizarReserva = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
  }

  try {
    const reserva = await Reserva.findByPk(id);

    if (!reserva) {
      return res.status(404).json({ mensaje: 'Reserva no encontrada.' });
    }

    if (reserva.estado !== 'CONFIRMADA') {
      return res.status(400).json({ mensaje: `No se puede marcar como utilizada una reserva en estado: ${reserva.estado}.` });
    }

    await reserva.update({ estado: 'UTILIZADA' });
    return res.status(200).json({ mensaje: 'Reserva registrada como utilizada exitosamente.', reserva });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al marcar reserva como utilizada', error: error.message });
  }
};

// Borrado Lógico (Soft Delete) con retorno de cupo
export const eliminarReserva = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
  }

  const transaction = await sequelize.transaction();
  try {
    const reserva = await Reserva.findByPk(id, { transaction });
    if (!reserva) {
      await transaction.rollback();
      return res.status(404).json({ mensaje: 'Reserva no encontrada.' });
    }

    // Si la reserva estaba activa, liberamos el cupo
    if (reserva.estado === 'PENDIENTE' || reserva.estado === 'CONFIRMADA') {
      const viaje = await Viaje.findByPk(reserva.id_viaje, { transaction });
      if (viaje) {
        await viaje.increment('cupos_disponibles', { by: 1, transaction });
      }
    }

    await reserva.destroy({ transaction });
    await transaction.commit();

    return res.status(200).json({ mensaje: 'Reserva deshabilitada correctamente (Borrado Lógico).' });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ mensaje: 'Error al deshabilitar la reserva', error: error.message });
  }
};

// Restaurar Reserva Deshabilitada
export const restaurarReserva = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
  }

  const transaction = await sequelize.transaction();
  try {
    const reserva = await Reserva.findByPk(id, { paranoid: false, transaction });
    if (!reserva) {
      await transaction.rollback();
      return res.status(404).json({ mensaje: 'Reserva no encontrada.' });
    }

    if (reserva.fecha_eliminacion === null) {
      await transaction.rollback();
      return res.status(400).json({ mensaje: 'La reserva ya se encuentra activa.' });
    }

    // Si la reserva restaurada estaba activa, se vuelve a descontar el cupo del viaje
    if (reserva.estado === 'PENDIENTE' || reserva.estado === 'CONFIRMADA') {
      const viaje = await Viaje.findByPk(reserva.id_viaje, { transaction });
      if (viaje) {
        await viaje.decrement('cupos_disponibles', { by: 1, transaction });
      }
    }

    await reserva.restore({ transaction });
    await transaction.commit();
    return res.status(200).json({ mensaje: 'Reserva restaurada correctamente', reserva });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ mensaje: 'Error al restaurar reserva', error: error.message });
  }
};