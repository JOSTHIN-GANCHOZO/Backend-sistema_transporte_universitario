import { AutobusConductor, Autobus, Conductor } from '../models/index.js';

export const obtenerAsignaciones = async (req, res) => {
  try {
    const asignaciones = await AutobusConductor.findAll({
      include: [
        { model: Autobus, attributes: ['id_autobus', 'placa', 'numero_interno', 'estado'] },
        { model: Conductor, attributes: ['id_conductor', 'nombres', 'apellidos', 'numero_licencia', 'fecha_vencimiento_licencia'] }
      ]
    });
    return res.status(200).json(asignaciones);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener asignaciones', error: error.message });
  }
};

export const crearAsignacion = async (req, res) => {
  try {
    const { id_autobus, id_conductor, horario } = req.body;

    const autobus = await Autobus.findByPk(id_autobus);
    if (!autobus) {
      return res.status(404).json({ mensaje: 'El autobús especificado no existe.' });
    }

    const conductor = await Conductor.findByPk(id_conductor);
    if (!conductor) {
      return res.status(404).json({ mensaje: 'El conductor especificado no existe.' });
    }

    // Buscar si existe la asignación incluso si fue eliminada previamente (soft deleted)
    const asignacionExistente = await AutobusConductor.findOne({
      where: { id_autobus, id_conductor },
      paranoid: false 
    });

    if (asignacionExistente) {
      // Si existía pero fue borrada lógicamente, la restauramos y actualizamos el horario
      if (asignacionExistente.deletedAt !== null) {
        await asignacionExistente.restore();
        asignacionExistente.horario = horario;
        await asignacionExistente.save();
        return res.status(200).json({ mensaje: 'Asignación reactivada con éxito.', asignacion: asignacionExistente });
      }
      return res.status(400).json({ mensaje: 'Esta asignación ya existe y se encuentra activa.' });
    }

    const nuevaAsignacion = await AutobusConductor.create({ id_autobus, id_conductor, horario });
    return res.status(201).json(nuevaAsignacion);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al crear asignación', error: error.message });
  }
};

export const eliminarAsignacion = async (req, res) => {
  try {
    const { id_autobus, id_conductor } = req.params;
    const asignacion = await AutobusConductor.findOne({ where: { id_autobus, id_conductor } });
    
    if (!asignacion) {
      return res.status(404).json({ mensaje: 'Asignación no encontrada.' });
    }

    // Al tener paranoid: true en el modelo, destroy() realiza un borrado lógico (actualiza deletedAt)
    await asignacion.destroy();
    return res.status(200).json({ mensaje: 'Asignación desactivada/eliminada lógicamente correctamente.' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al eliminar asignación', error: error.message });
  }
};