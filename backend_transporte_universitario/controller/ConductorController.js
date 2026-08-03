import { Conductor } from '../models/index.js';

export const obtenerConductores = async (req, res) => {
  try {
    const conductores = await Conductor.findAll();
    return res.status(200).json(conductores);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener conductores', error: error.message });
  }
};

export const obtenerConductorPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const conductor = await Conductor.findByPk(id);
    if (!conductor) {
      return res.status(404).json({ mensaje: 'Conductor no encontrado' });
    }
    return res.status(200).json(conductor);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener conductor', error: error.message });
  }
};

export const crearConductor = async (req, res) => {
  try {
    const { identificacion, nombres, apellidos, telefono, correo, numero_licencia, fecha_vencimiento_licencia } = req.body;

    const nuevoConductor = await Conductor.create({
      identificacion,
      nombres,
      apellidos,
      telefono,
      correo,
      numero_licencia,
      fecha_vencimiento_licencia
    });

    return res.status(201).json(nuevoConductor);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        mensaje: 'La identificación o el número de licencia ya existen.' 
      });
    }
    return res.status(500).json({ mensaje: 'Error al crear conductor', error: error.message });
  }
};

export const actualizarConductor = async (req, res) => {
  try {
    const { id } = req.params;
    const conductor = await Conductor.findByPk(id);
    if (!conductor) {
      return res.status(404).json({ mensaje: 'Conductor no encontrado' });
    }

    delete req.body.id_conductor;

    await conductor.update(req.body);
    return res.status(200).json(conductor);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        mensaje: 'La identificación o el número de licencia ya existen.' 
      });
    }
    return res.status(500).json({ mensaje: 'Error al actualizar conductor', error: error.message });
  }
};

// Borrado Lógico (Soft Delete)
export const eliminarConductor = async (req, res) => {
  try {
    const { id } = req.params;
    const conductor = await Conductor.findByPk(id);
    if (!conductor) {
      return res.status(404).json({ mensaje: 'Conductor no encontrado' });
    }
    await conductor.destroy();
    return res.status(200).json({ mensaje: 'Conductor deshabilitado correctamente (Borrado Lógico)' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al deshabilitar conductor', error: error.message });
  }
};

// Restaurar Conductor Deshabilitado
export const restaurarConductor = async (req, res) => {
  try {
    const { id } = req.params;
    const conductor = await Conductor.findByPk(id, { paranoid: false });
    if (!conductor) {
      return res.status(404).json({ mensaje: 'Conductor no encontrado' });
    }
    await conductor.restore();
    return res.status(200).json({ mensaje: 'Conductor restaurado correctamente', conductor });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al restaurar conductor', error: error.message });
  }
};
