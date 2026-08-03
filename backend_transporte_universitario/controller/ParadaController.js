import { Parada } from '../models/index.js';

export const obtenerParadas = async (req, res) => {
  try {
    const paradas = await Parada.findAll();
    return res.status(200).json(paradas);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener paradas', error: error.message });
  }
};

export const obtenerParadaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
    }

    const parada = await Parada.findByPk(id);
    if (!parada) {
      return res.status(404).json({ mensaje: 'Parada no encontrada.' });
    }
    return res.status(200).json(parada);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener parada', error: error.message });
  }
};

export const crearParada = async (req, res) => {
  try {
    const { codigo, nombre, direccion, ubicacion_referencia } = req.body;
    const errores = [];

    // --- VALIDACIONES EN EL CONTROLADOR ---
    if (!codigo || typeof codigo !== 'string' || !codigo.trim()) {
      errores.push({ campo: 'codigo', mensaje: 'El código de la parada es obligatorio.' });
    }

    if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
      errores.push({ campo: 'nombre', mensaje: 'El nombre de la parada es obligatorio.' });
    }

    if (errores.length > 0) {
      return res.status(400).json({ mensaje: 'Errores de validación', errores });
    }

    // Regla de negocio: Verificar si el código ya existe
    const codigoExistente = await Parada.findOne({ 
      where: { codigo: codigo.trim().toUpperCase() } 
    });
    
    if (codigoExistente) {
      return res.status(400).json({ mensaje: 'El código de parada especificado ya se encuentra registrado.' });
    }

    const nuevaParada = await Parada.create({
      codigo: codigo.trim().toUpperCase(),
      nombre: nombre.trim(),
      direccion: direccion ? direccion.trim() : null,
      ubicacion_referencia: ubicacion_referencia ? ubicacion_referencia.trim() : null
    });

    return res.status(201).json(nuevaParada);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ mensaje: 'El código de parada ya existe.' });
    }
    return res.status(500).json({ mensaje: 'Error al crear parada', error: error.message });
  }
};

export const actualizarParada = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
    }

    const parada = await Parada.findByPk(id);
    if (!parada) {
      return res.status(404).json({ mensaje: 'Parada no encontrada.' });
    }

    // Si se intenta actualizar el código, verificar unicidad
    if (req.body.codigo) {
      const nuevoCodigo = req.body.codigo.trim().toUpperCase();
      const codigoExistente = await Parada.findOne({ where: { codigo: nuevoCodigo } });

      if (codigoExistente && codigoExistente.id_parada !== Number(id)) {
        return res.status(400).json({ mensaje: 'El código ingresado ya pertenece a otra parada.' });
      }
      req.body.codigo = nuevoCodigo;
    }

    if (req.body.nombre) {
      req.body.nombre = req.body.nombre.trim();
    }

    delete req.body.id_parada;

    await parada.update(req.body);
    return res.status(200).json(parada);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al actualizar parada', error: error.message });
  }
};

// Borrado Lógico (Soft Delete)
export const eliminarParada = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
    }

    const parada = await Parada.findByPk(id);
    if (!parada) {
      return res.status(404).json({ mensaje: 'Parada no encontrada.' });
    }

    await parada.destroy();
    return res.status(200).json({ mensaje: 'Parada deshabilitada correctamente (Borrado Lógico).' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al deshabilitar parada', error: error.message });
  }
};

// Restaurar Parada Deshabilitada
export const restaurarParada = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
    }

    const parada = await Parada.findByPk(id, { paranoid: false });
    if (!parada) {
      return res.status(404).json({ mensaje: 'Parada no encontrada.' });
    }

    if (parada.fecha_eliminacion === null) {
      return res.status(400).json({ mensaje: 'La parada ya se encuentra activa.' });
    }

    await parada.restore();
    return res.status(200).json({ mensaje: 'Parada restaurada correctamente', parada });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al restaurar parada', error: error.message });
  }
};