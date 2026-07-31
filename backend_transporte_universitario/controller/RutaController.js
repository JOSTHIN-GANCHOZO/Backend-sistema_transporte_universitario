import { Ruta } from '../models/index.js';

export const obtenerRutas = async (req, res) => {
  try {
    const rutas = await Ruta.findAll();
    return res.status(200).json(rutas);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener rutas', error: error.message });
  }
};

export const obtenerRutaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
    }

    const ruta = await Ruta.findByPk(id);
    if (!ruta) {
      return res.status(404).json({ mensaje: 'Ruta no encontrada.' });
    }
    return res.status(200).json(ruta);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener ruta', error: error.message });
  }
};

export const crearRuta = async (req, res) => {
  try {
    const { codigo, nombre, origen, destino, distancia_estimada, duracion_aproximada } = req.body;
    const errores = [];

    // --- VALIDACIONES DE ENTRADA ---
    if (!codigo || typeof codigo !== 'string' || !codigo.trim()) {
      errores.push({ campo: 'codigo', mensaje: 'El código de la ruta es obligatorio.' });
    }

    if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
      errores.push({ campo: 'nombre', mensaje: 'El nombre de la ruta es obligatorio.' });
    }

    if (!origen || typeof origen !== 'string' || !origen.trim()) {
      errores.push({ campo: 'origen', mensaje: 'El origen es obligatorio.' });
    }

    if (!destino || typeof destino !== 'string' || !destino.trim()) {
      errores.push({ campo: 'destino', mensaje: 'El destino es obligatorio.' });
    }

    if (distancia_estimada !== undefined && (isNaN(Number(distancia_estimada)) || Number(distancia_estimada) < 0)) {
      errores.push({ campo: 'distancia_estimada', mensaje: 'La distancia debe ser un valor numérico positivo.' });
    }

    if (errores.length > 0) {
      return res.status(400).json({ mensaje: 'Errores de validación', errores });
    }

    const codigoFormateado = codigo.trim().toUpperCase();

    // Verificación de duplicados antes de insertar
    const rutaExistente = await Ruta.findOne({ where: { codigo: codigoFormateado } });
    if (rutaExistente) {
      return res.status(400).json({ mensaje: 'El código de ruta ya se encuentra registrado.' });
    }

    const nuevaRuta = await Ruta.create({
      codigo: codigoFormateado,
      nombre: nombre.trim(),
      origen: origen.trim(),
      destino: destino.trim(),
      distancia_estimada: distancia_estimada ? Number(distancia_estimada) : null,
      duracion_aproximada: duracion_aproximada || null
    });

    return res.status(201).json(nuevaRuta);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ mensaje: 'El código de ruta ya existe.' });
    }
    return res.status(500).json({ mensaje: 'Error al crear ruta', error: error.message });
  }
};

export const actualizarRuta = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
    }

    const ruta = await Ruta.findByPk(id);
    if (!ruta) {
      return res.status(404).json({ mensaje: 'Ruta no encontrada.' });
    }

    // Si actualiza el código, validar unicidad
    if (req.body.codigo) {
      if (typeof req.body.codigo !== 'string' || !req.body.codigo.trim()) {
        return res.status(400).json({ mensaje: 'El código de ruta no puede estar vacío.' });
      }

      const nuevoCodigo = req.body.codigo.trim().toUpperCase();
      const rutaDuplicada = await Ruta.findOne({ where: { codigo: nuevoCodigo } });

      if (rutaDuplicada && rutaDuplicada.id_ruta !== Number(id)) {
        return res.status(400).json({ mensaje: 'El código de ruta ya pertenece a otro registro.' });
      }

      req.body.codigo = nuevoCodigo;
    }

    if (req.body.nombre) req.body.nombre = req.body.nombre.trim();
    if (req.body.origen) req.body.origen = req.body.origen.trim();
    if (req.body.destino) req.body.destino = req.body.destino.trim();
    if (req.body.distancia_estimada !== undefined) {
      if (isNaN(Number(req.body.distancia_estimada)) || Number(req.body.distancia_estimada) < 0) {
        return res.status(400).json({ mensaje: 'La distancia debe ser un valor numérico positivo.' });
      }
    }

    await ruta.update(req.body);
    return res.status(200).json(ruta);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ mensaje: 'El código de ruta ya existe.' });
    }
    return res.status(500).json({ mensaje: 'Error al actualizar ruta', error: error.message });
  }
};

// Borrado Lógico (Soft Delete)
export const eliminarRuta = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
    }

    const ruta = await Ruta.findByPk(id);
    if (!ruta) {
      return res.status(404).json({ mensaje: 'Ruta no encontrada.' });
    }

    await ruta.destroy();
    return res.status(200).json({ mensaje: 'Ruta deshabilitada correctamente (Borrado Lógico).' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al deshabilitar ruta', error: error.message });
  }
};

// Restaurar Ruta Deshabilitada
export const restaurarRuta = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
    }

    const ruta = await Ruta.findByPk(id, { paranoid: false });
    if (!ruta) {
      return res.status(404).json({ mensaje: 'Ruta no encontrada.' });
    }

    if (ruta.fecha_eliminacion === null) {
      return res.status(400).json({ mensaje: 'La ruta ya se encuentra activa.' });
    }

    await ruta.restore();
    return res.status(200).json({ mensaje: 'Ruta restaurada correctamente', ruta });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al restaurar ruta', error: error.message });
  }
};