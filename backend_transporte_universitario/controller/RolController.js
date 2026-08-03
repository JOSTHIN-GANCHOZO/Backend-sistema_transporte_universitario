import { Rol } from '../models/index.js';

export const obtenerRoles = async (req, res) => {
  try {
    const roles = await Rol.findAll();
    return res.status(200).json(roles);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener roles', error: error.message });
  }
};

export const obtenerRolPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
    }

    const rol = await Rol.findByPk(id);
    if (!rol) {
      return res.status(404).json({ mensaje: 'Rol no encontrado.' });
    }
    return res.status(200).json(rol);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener rol', error: error.message });
  }
};

export const crearRol = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    // --- VALIDACIÓN EN EL CONTROLADOR ---
    if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
      return res.status(400).json({ mensaje: 'El nombre del rol es obligatorio.' });
    }

    const nombreFormateado = nombre.trim().toUpperCase();

    // Regla de negocio: Comprobar si ya existe
    const rolExistente = await Rol.findOne({ where: { nombre: nombreFormateado } });
    if (rolExistente) {
      return res.status(400).json({ mensaje: 'El nombre del rol ya se encuentra registrado.' });
    }

    const nuevoRol = await Rol.create({
      nombre: nombreFormateado,
      descripcion: descripcion ? descripcion.trim() : null
    });

    return res.status(201).json(nuevoRol);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ mensaje: 'El nombre del rol ya existe.' });
    }
    return res.status(500).json({ mensaje: 'Error al crear rol', error: error.message });
  }
};

export const actualizarRol = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
    }

    const rol = await Rol.findByPk(id);
    if (!rol) {
      return res.status(404).json({ mensaje: 'Rol no encontrado.' });
    }

    // Si se actualiza el nombre, formatear y validar unicidad
    if (req.body.nombre) {
      if (typeof req.body.nombre !== 'string' || !req.body.nombre.trim()) {
        return res.status(400).json({ mensaje: 'El nombre del rol no puede estar vacío.' });
      }

      const nuevoNombre = req.body.nombre.trim().toUpperCase();
      const rolDuplicado = await Rol.findOne({ where: { nombre: nuevoNombre } });

      if (rolDuplicado && rolDuplicado.id_rol !== Number(id)) {
        return res.status(400).json({ mensaje: 'El nombre del rol ya pertenece a otro registro.' });
      }

      req.body.nombre = nuevoNombre;
    }

    if (req.body.descripcion) {
      req.body.descripcion = req.body.descripcion.trim();
    }

    delete req.body.id_rol;

    await rol.update(req.body);
    return res.status(200).json(rol);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al actualizar rol', error: error.message });
  }
};

// Borrado Lógico (Soft Delete)
export const eliminarRol = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
    }

    const rol = await Rol.findByPk(id);
    if (!rol) {
      return res.status(404).json({ mensaje: 'Rol no encontrado.' });
    }

    await rol.destroy();
    return res.status(200).json({ mensaje: 'Rol deshabilitado correctamente (Borrado Lógico).' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al deshabilitar rol', error: error.message });
  }
};

// Restaurar Rol Deshabilitado
export const restaurarRol = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
    }

    const rol = await Rol.findByPk(id, { paranoid: false });
    if (!rol) {
      return res.status(404).json({ mensaje: 'Rol no encontrado.' });
    }

    if (rol.fecha_eliminacion === null) {
      return res.status(400).json({ mensaje: 'El rol ya se encuentra activo.' });
    }

    await rol.restore();
    return res.status(200).json({ mensaje: 'Rol restaurado correctamente', rol });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al restaurar rol', error: error.message });
  }
};