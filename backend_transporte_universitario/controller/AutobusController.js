import { Autobus } from '../models/index.js';

export const obtenerAutobuses = async (req, res) => {
  try {
    const autobuses = await Autobus.findAll();
    return res.status(200).json(autobuses);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener autobuses', error: error.message });
  }
};

export const obtenerAutobusPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const autobus = await Autobus.findByPk(id);
    if (!autobus) {
      return res.status(404).json({ mensaje: 'Autobús no encontrado' });
    }
    return res.status(200).json(autobus);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener autobús', error: error.message });
  }
};

export const crearAutobus = async (req, res) => {
  try {
    const { placa, numero_interno, marca, modelo, año, capacidad_maxima, estado } = req.body;

    if (capacidad_maxima <= 0) {
      return res.status(400).json({ mensaje: 'La capacidad máxima debe ser mayor a 0.' });
    }

    const nuevoAutobus = await Autobus.create({
      placa,
      numero_interno,
      marca,
      modelo,
      año,
      capacidad_maxima,
      estado: estado || 'DISPONIBLE'
    });

    return res.status(201).json(nuevoAutobus);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        mensaje: 'La placa o el número interno ya están registrados.' 
      });
    }
    return res.status(500).json({ mensaje: 'Error al crear autobús', error: error.message });
  }
};

export const actualizarAutobus = async (req, res) => {
  try {
    const { id } = req.params;
    const autobus = await Autobus.findByPk(id);
    if (!autobus) {
      return res.status(404).json({ mensaje: 'Autobús no encontrado' });
    }

    if (req.body.capacidad_maxima !== undefined && req.body.capacidad_maxima <= 0) {
      return res.status(400).json({ mensaje: 'La capacidad máxima debe ser mayor a 0.' });
    }

    await autobus.update(req.body);
    return res.status(200).json(autobus);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        mensaje: 'La placa o el número interno ya están registrados.' 
      });
    }
    return res.status(500).json({ mensaje: 'Error al actualizar autobús', error: error.message });
  }
};

// Borrado Lógico (Soft Delete)
export const eliminarAutobus = async (req, res) => {
  try {
    const { id } = req.params;
    const autobus = await Autobus.findByPk(id);
    if (!autobus) {
      return res.status(404).json({ mensaje: 'Autobús no encontrado' });
    }
    await autobus.destroy();
    return res.status(200).json({ mensaje: 'Autobús deshabilitado correctamente (Borrado Lógico)' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al deshabilitar autobús', error: error.message });
  }
};

// Restaurar Autobús Deshabilitado
export const restaurarAutobus = async (req, res) => {
  try {
    const { id } = req.params;
    const autobus = await Autobus.findByPk(id, { paranoid: false });
    if (!autobus) {
      return res.status(404).json({ mensaje: 'Autobús no encontrado' });
    }
    await autobus.restore();
    return res.status(200).json({ mensaje: 'Autobús restaurado correctamente', autobus });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al restaurar autobús', error: error.message });
  }
};
