import { Viaje, Autobus, Conductor, Ruta, Reserva, Mantenimiento, sequelize } from '../models/index.js';

export const obtenerViajes = async (req, res) => {
  try {
    const viajes = await Viaje.findAll({
      include: [
        { model: Ruta, attributes: ['id_ruta', 'codigo', 'nombre', 'origen', 'destino'] },
        { model: Autobus, attributes: ['id_autobus', 'placa', 'numero_interno', 'capacidad_maxima', 'estado'] },
        { model: Conductor, attributes: ['id_conductor', 'identificacion', 'nombres', 'apellidos', 'numero_licencia', 'fecha_vencimiento_licencia'] }
      ]
    });
    return res.status(200).json(viajes);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener viajes', error: error.message });
  }
};

export const obtenerViajePorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
    }

    const viaje = await Viaje.findByPk(id, {
      include: [
        { model: Ruta },
        { model: Autobus },
        { model: Conductor },
        { model: Reserva }
      ]
    });

    if (!viaje) {
      return res.status(404).json({ mensaje: 'Viaje no encontrado.' });
    }
    return res.status(200).json(viaje);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener viaje', error: error.message });
  }
};

export const crearViaje = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { fecha, hora_salida, hora_llegada_estimada, id_ruta, id_autobus, id_conductor } = req.body;
    const errores = [];

    // --- VALIDACIONES DE ENTRADA ---
    if (!fecha || isNaN(Date.parse(fecha))) {
      errores.push({ campo: 'fecha', mensaje: 'La fecha del viaje es obligatoria y debe ser una fecha válida (YYYY-MM-DD).' });
    }

    if (!hora_salida || typeof hora_salida !== 'string' || !hora_salida.trim()) {
      errores.push({ campo: 'hora_salida', mensaje: 'La hora de salida es obligatoria.' });
    }

    if (!id_ruta || isNaN(Number(id_ruta))) {
      errores.push({ campo: 'id_ruta', mensaje: 'El ID de la ruta es obligatorio y debe ser numérico.' });
    }

    if (!id_autobus || isNaN(Number(id_autobus))) {
      errores.push({ campo: 'id_autobus', mensaje: 'El ID del autobús es obligatorio y debe ser numérico.' });
    }

    if (!id_conductor || isNaN(Number(id_conductor))) {
      errores.push({ campo: 'id_conductor', mensaje: 'El ID del conductor es obligatorio y debe ser numérico.' });
    }

    if (errores.length > 0) {
      await transaction.rollback();
      return res.status(400).json({ mensaje: 'Errores de validación', errores });
    }

    // 1. Verificar existencia de la ruta
    const ruta = await Ruta.findByPk(id_ruta, { transaction });
    if (!ruta) {
      await transaction.rollback();
      return res.status(404).json({ mensaje: 'La ruta especificada no existe.' });
    }

    // 2. Verificar existencia y estado del Autobús
    const autobus = await Autobus.findByPk(id_autobus, { transaction });
    if (!autobus) {
      await transaction.rollback();
      return res.status(404).json({ mensaje: 'El autobús especificado no existe.' });
    }
    if (autobus.estado !== 'DISPONIBLE') {
      await transaction.rollback();
      return res.status(400).json({
        mensaje: `El autobús con placa ${autobus.placa} no está disponible. Estado actual: ${autobus.estado}.`
      });
    }

    // 3. Verificar existencia y vigencia de la Licencia del Conductor
    const conductor = await Conductor.findByPk(id_conductor, { transaction });
    if (!conductor) {
      await transaction.rollback();
      return res.status(404).json({ mensaje: 'El conductor especificado no existe.' });
    }

    const fechaViaje = new Date(fecha);
    const fechaVencimientoLicencia = new Date(conductor.fecha_vencimiento_licencia);

    if (fechaVencimientoLicencia < fechaViaje) {
      await transaction.rollback();
      return res.status(400).json({
        mensaje: `La licencia del conductor ${conductor.nombres} ${conductor.apellidos} está vencida (${conductor.fecha_vencimiento_licencia}). No puede ser asignado a un viaje en la fecha ${fecha}.`
      });
    }

    // 4. Prevenir solapamiento del Autobús en la misma fecha y hora
    const viajeBusExistente = await Viaje.findOne({
      where: {
        id_autobus: Number(id_autobus),
        fecha,
        hora_salida,
        estado: ['PROGRAMADO', 'EN_RECORRIDO']
      },
      transaction
    });
    if (viajeBusExistente) {
      await transaction.rollback();
      return res.status(400).json({ mensaje: 'El autobús ya está asignado a otro viaje activo en la misma fecha y hora de salida.' });
    }

    // 5. Prevenir solapamiento del Conductor en la misma fecha y hora
    const viajeConductorExistente = await Viaje.findOne({
      where: {
        id_conductor: Number(id_conductor),
        fecha,
        hora_salida,
        estado: ['PROGRAMADO', 'EN_RECORRIDO']
      },
      transaction
    });
    if (viajeConductorExistente) {
      await transaction.rollback();
      return res.status(400).json({ mensaje: 'El conductor ya tiene un viaje programado activo en la misma fecha y hora de salida.' });
    }

    // 6. Crear el viaje e inicializar cupos con la capacidad máxima del autobús
    const nuevoViaje = await Viaje.create({
      fecha,
      hora_salida: hora_salida.trim(),
      hora_llegada_estimada: hora_llegada_estimada ? hora_llegada_estimada.trim() : null,
      estado: 'PROGRAMADO',
      cupos_disponibles: autobus.capacidad_maxima,
      id_ruta: Number(id_ruta),
      id_autobus: Number(id_autobus),
      id_conductor: Number(id_conductor)
    }, { transaction });

    await transaction.commit();
    return res.status(201).json(nuevoViaje);
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ mensaje: 'Error al programar viaje', error: error.message });
  }
};

export const actualizarEstadoViaje = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!id || isNaN(Number(id))) {
      await transaction.rollback();
      return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
    }

    const estadosValidos = ['PROGRAMADO', 'EN_RECORRIDO', 'FINALIZADO', 'CANCELADO'];
    if (!estado || !estadosValidos.includes(estado)) {
      await transaction.rollback();
      return res.status(400).json({ mensaje: `Estado inválido. Valores permitidos: ${estadosValidos.join(', ')}` });
    }

    const viaje = await Viaje.findByPk(id, { transaction });
    if (!viaje) {
      await transaction.rollback();
      return res.status(404).json({ mensaje: 'Viaje no encontrado.' });
    }

    // Cancelación en cascada: al cancelar el viaje, se cancelan sus reservas activas
    if (estado === 'CANCELADO' && viaje.estado !== 'CANCELADO') {
      await Reserva.update(
        { estado: 'CANCELADA' },
        {
          where: {
            id_viaje: Number(id),
            estado: ['PENDIENTE', 'CONFIRMADA']
          },
          transaction
        }
      );
    }

    await viaje.update({ estado }, { transaction });

    // Sincronizar el estado del autobús con el estado del viaje
    if (estado === 'EN_RECORRIDO') {
      const autobus = await Autobus.findByPk(viaje.id_autobus, { transaction });
      if (autobus && autobus.estado === 'DISPONIBLE') {
        await autobus.update({ estado: 'EN_SERVICIO' }, { transaction });
      }
    }

    if (estado === 'FINALIZADO' || estado === 'CANCELADO') {
      const otroViajeActivo = await Viaje.findOne({
        where: {
          id_autobus: viaje.id_autobus,
          id_viaje: { [sequelize.Sequelize.Op.ne]: viaje.id_viaje },
          estado: ['PROGRAMADO', 'EN_RECORRIDO']
        },
        transaction
      });

      if (!otroViajeActivo) {
        const mantenimientoActivo = await Mantenimiento.findOne({
          where: {
            id_autobus: viaje.id_autobus,
            estado: ['PENDIENTE', 'EN_PROCESO']
          },
          transaction
        });

        if (!mantenimientoActivo) {
          const autobus = await Autobus.findByPk(viaje.id_autobus, { transaction });
          if (autobus) {
            await autobus.update({ estado: 'DISPONIBLE' }, { transaction });
          }
        }
      }
    }

    await transaction.commit();

    return res.status(200).json({ mensaje: `Estado del viaje actualizado a "${estado}" correctamente`, viaje });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ mensaje: 'Error al actualizar el estado del viaje', error: error.message });
  }
};

// Borrado Lógico (Soft Delete)
export const eliminarViaje = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
    }

    const viaje = await Viaje.findByPk(id);
    if (!viaje) {
      return res.status(404).json({ mensaje: 'Viaje no encontrado.' });
    }

    if (viaje.estado !== 'CANCELADO' && viaje.estado !== 'FINALIZADO') {
      return res.status(400).json({ mensaje: 'Solo pueden deshabilitarse o eliminarse viajes en estado CANCELADO o FINALIZADO.' });
    }

    await viaje.destroy();
    return res.status(200).json({ mensaje: 'Viaje deshabilitado correctamente (Borrado Lógico).' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al deshabilitar viaje', error: error.message });
  }
};

// Restaurar Viaje Deshabilitado
export const restaurarViaje = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
    }

    const viaje = await Viaje.findByPk(id, { paranoid: false });
    if (!viaje) {
      return res.status(404).json({ mensaje: 'Viaje no encontrado.' });
    }

    if (viaje.fecha_eliminacion === null) {
      return res.status(400).json({ mensaje: 'El viaje ya se encuentra activo.' });
    }

    await viaje.restore();

    // Si el viaje restaurado estaba en recorrido, el autobús vuelve a estar en servicio
    if (viaje.estado === 'EN_RECORRIDO') {
      const autobus = await Autobus.findByPk(viaje.id_autobus);
      if (autobus && autobus.estado === 'DISPONIBLE') {
        await autobus.update({ estado: 'EN_SERVICIO' });
      }
    }

    return res.status(200).json({ mensaje: 'Viaje restaurado correctamente', viaje });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al restaurar viaje', error: error.message });
  }
};