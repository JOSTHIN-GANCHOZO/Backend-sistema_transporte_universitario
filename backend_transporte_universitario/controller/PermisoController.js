import { Permiso } from '../models/index.js';

export const obtenerPermisos = async (req, res) => {
  try {
    const permisos = await Permiso.findAll();
    return res.status(200).json(permisos);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener permisos', error: error.message });
  }
};

export const obtenerPermisoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
    }

    const permiso = await Permiso.findByPk(id);
    if (!permiso) {
      return res.status(404).json({ mensaje: 'Permiso no encontrado.' });
    }
    return res.status(200).json(permiso);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener permiso', error: error.message });
  }
};

export const crearPermiso = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    // --- VALIDACIÓN EN EL CONTROLADOR ---
    if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
      return res.status(400).json({ mensaje: 'El nombre del permiso es obligatorio.' });
    }

    const nombreFormateado = nombre.trim().toUpperCase();

    // Regla de negocio: Comprobar duplicados
    const permisoExistente = await Permiso.findOne({ where: { nombre: nombreFormateado } });
    if (permisoExistente) {
      return res.status(400).json({ mensaje: 'El nombre del permiso ya se encuentra registrado.' });
    }

    const nuevoPermiso = await Permiso.create({
      nombre: nombreFormateado,
      descripcion: descripcion ? descripcion.trim() : null
    });

    return res.status(201).json(nuevoPermiso);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ mensaje: 'El nombre del permiso ya existe.' });
    }
    return res.status(500).json({ mensaje: 'Error al crear permiso', error: error.message });
  }
};

export const actualizarPermiso = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
    }

    const permiso = await Permiso.findByPk(id);
    if (!permiso) {
      return res.status(404).json({ mensaje: 'Permiso no encontrado.' });
    }

    // Si se actualiza el nombre, verificar unicidad y formatear
    if (req.body.nombre) {
      if (typeof req.body.nombre !== 'string' || !req.body.nombre.trim()) {
        return res.status(400).json({ mensaje: 'El nombre del permiso no puede estar vacío.' });
      }

      const nuevoNombre = req.body.nombre.trim().toUpperCase();
      const permisoDuplicado = await Permiso.findOne({ where: { nombre: nuevoNombre } });

      if (permisoDuplicado && permisoDuplicado.id_permiso !== Number(id)) {
        return res.status(400).json({ mensaje: 'El nombre del permiso ya pertenece a otro registro.' });
      }

      req.body.nombre = nuevoNombre;
    }

    if (req.body.descripcion) {
      req.body.descripcion = req.body.descripcion.trim();
    }

    await permiso.update(req.body);
    return res.status(200).json(permiso);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al actualizar permiso', error: error.message });
  }
};

// Borrado Lógico (Soft Delete)
export const eliminarPermiso = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
    }

    const permiso = await Permiso.findByPk(id);
    if (!permiso) {
      return res.status(404).json({ mensaje: 'Permiso no encontrado.' });
    }

    await permiso.destroy();
    return res.status(200).json({ mensaje: 'Permiso deshabilitado correctamente (Borrado Lógico).' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al deshabilitar permiso', error: error.message });
  }
};

// Restaurar Permiso Deshabilitado
export const restaurarPermiso = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
    }

    const permiso = await Permiso.findByPk(id, { paranoid: false });
    if (!permiso) {
      return res.status(404).json({ mensaje: 'Permiso no encontrado.' });
    }

    if (permiso.fecha_eliminacion === null) {
      return res.status(400).json({ mensaje: 'El permiso ya se encuentra activo.' });
    }

    await permiso.restore();
    return res.status(200).json({ mensaje: 'Permiso restaurado correctamente', permiso });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al restaurar permiso', error: error.message });
  }
};