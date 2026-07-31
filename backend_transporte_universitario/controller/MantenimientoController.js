import { Mantenimiento, Autobus, sequelize } from '../models/index.js';

export const obtenerMantenimientos = async (req, res) => {
  try {
    const mantenimientos = await Mantenimiento.findAll({
      include: [{ model: Autobus, attributes: ['id_autobus', 'placa', 'numero_interno', 'estado'] }]
    });
    return res.status(200).json(mantenimientos);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener mantenimientos', error: error.message });
  }
};

export const obtenerMantenimientoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const mantenimiento = await Mantenimiento.findByPk(id, {
      include: [{ model: Autobus, attributes: ['id_autobus', 'placa', 'numero_interno', 'estado'] }]
    });
    if (!mantenimiento) {
      return res.status(404).json({ mensaje: 'Mantenimiento no encontrado' });
    }
    return res.status(200).json(mantenimiento);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener mantenimiento', error: error.message });
  }
};

export const crearMantenimiento = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { fecha_inicio, fecha_fin, tipo_mantenimiento, descripcion, costo, estado, id_autobus } = req.body;

    if (fecha_fin && new Date(fecha_fin) < new Date(fecha_inicio)) {
      await transaction.rollback();
      return res.status(400).json({ 
        mensaje: 'La fecha de fin debe ser posterior o igual a la fecha de inicio.' 
      });
    }

    const autobus = await Autobus.findByPk(id_autobus, { transaction });
    if (!autobus) {
      await transaction.rollback();
      return res.status(404).json({ mensaje: 'El autobús especificado no existe.' });
    }

    const nuevoMantenimiento = await Mantenimiento.create({
      fecha_inicio,
      fecha_fin,
      tipo_mantenimiento,
      descripcion,
      costo,
      estado: estado || 'EN_PROCESO',
      id_autobus
    }, { transaction });

    // Actualización automática del estado del autobús a EN_MANTENIMIENTO
    await autobus.update({ estado: 'EN_MANTENIMIENTO' }, { transaction });

    await transaction.commit();
    return res.status(201).json(nuevoMantenimiento);
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ mensaje: 'Error al registrar mantenimiento', error: error.message });
  }
};

export const actualizarMantenimiento = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const mantenimiento = await Mantenimiento.findByPk(id, { transaction });
    if (!mantenimiento) {
      await transaction.rollback();
      return res.status(404).json({ mensaje: 'Mantenimiento no encontrado' });
    }

    const fechaInicioEfectiva = req.body.fecha_inicio || mantenimiento.fecha_inicio;
    const fechaFinEfectiva = req.body.fecha_fin !== undefined ? req.body.fecha_fin : mantenimiento.fecha_fin;

    if (fechaFinEfectiva && new Date(fechaFinEfectiva) < new Date(fechaInicioEfectiva)) {
      await transaction.rollback();
      return res.status(400).json({ 
        mensaje: 'La fecha de fin debe ser posterior o igual a la fecha de inicio.' 
      });
    }

    await mantenimiento.update(req.body, { transaction });

    if (req.body.estado === 'FINALIZADO' || req.body.estado === 'COMPLETADO') {
      const autobus = await Autobus.findByPk(mantenimiento.id_autobus, { transaction });
      if (autobus) {
        await autobus.update({ estado: 'DISPONIBLE' }, { transaction });
      }
    }

    await transaction.commit();
    return res.status(200).json(mantenimiento);
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ mensaje: 'Error al actualizar mantenimiento', error: error.message });
  }
};

// Borrado Lógico (Soft Delete)
export const eliminarMantenimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const mantenimiento = await Mantenimiento.findByPk(id);
    if (!mantenimiento) {
      return res.status(404).json({ mensaje: 'Mantenimiento no encontrado' });
    }
    await mantenimiento.destroy();
    return res.status(200).json({ mensaje: 'Mantenimiento deshabilitado correctamente (Borrado Lógico)' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al deshabilitar mantenimiento', error: error.message });
  }
};

// Restaurar Mantenimiento Deshabilitado
export const restaurarMantenimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const mantenimiento = await Mantenimiento.findByPk(id, { paranoid: false });
    if (!mantenimiento) {
      return res.status(404).json({ mensaje: 'Mantenimiento no encontrado' });
    }
    await mantenimiento.restore();
    return res.status(200).json({ mensaje: 'Mantenimiento restaurado correctamente', mantenimiento });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al restaurar mantenimiento', error: error.message });
  }
};
