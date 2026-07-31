import { RutaParada, Ruta, Parada, sequelize } from '../models/index.js';

// Obtener todas las paradas de una ruta específica ordenadas por su orden
export const obtenerParadasDeRuta = async (req, res) => {
  try {
    const { id_ruta } = req.params;

    if (!id_ruta || isNaN(Number(id_ruta))) {
      return res.status(400).json({ mensaje: 'El ID de la ruta proporcionado no es válido.' });
    }

    const ruta = await Ruta.findByPk(id_ruta);
    if (!ruta) {
      return res.status(404).json({ mensaje: 'Ruta no encontrada.' });
    }

    const paradas = await RutaParada.findAll({
      where: { id_ruta: Number(id_ruta) },
      include: [{ 
        model: Parada, 
        attributes: ['id_parada', 'codigo', 'nombre', 'direccion', 'ubicacion_referencia'] 
      }],
      order: [['orden', 'ASC']]
    });

    return res.status(200).json(paradas);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener paradas de la ruta', error: error.message });
  }
};

// Asignar o reemplazar el listado completo de paradas de una ruta
export const asignarParadasARuta = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id_ruta, paradas } = req.body;
    const errores = [];

    if (!id_ruta || isNaN(Number(id_ruta))) {
      errores.push({ campo: 'id_ruta', mensaje: 'El ID de la ruta es obligatorio y debe ser numérico.' });
    }

    if (!Array.isArray(paradas) || paradas.length < 2) {
      errores.push({ campo: 'paradas', mensaje: 'Una ruta debe tener al menos 2 paradas asignadas (Origen y Destino).' });
    }

    if (errores.length > 0) {
      await transaction.rollback();
      return res.status(400).json({ mensaje: 'Errores de validación', errores });
    }

    const ruta = await Ruta.findByPk(id_ruta, { transaction });
    if (!ruta) {
      await transaction.rollback();
      return res.status(404).json({ mensaje: 'Ruta no encontrada.' });
    }

    // Validar integridad del arreglo enviado
    const ordenes = [];
    const paradasIds = [];

    for (let i = 0; i < paradas.length; i++) {
      const p = paradas[i];
      if (!p.id_parada || isNaN(Number(p.id_parada))) {
        await transaction.rollback();
        return res.status(400).json({ mensaje: `La parada en el índice ${i} no contiene un id_parada válido.` });
      }
      if (!p.orden || isNaN(Number(p.orden)) || Number(p.orden) <= 0) {
        await transaction.rollback();
        return res.status(400).json({ mensaje: `La parada en el índice ${i} debe tener un número de orden entero positivo.` });
      }
      ordenes.push(Number(p.orden));
      paradasIds.push(Number(p.id_parada));
    }

    // Validar ordenes sin duplicados
    if (new Set(ordenes).size !== ordenes.length) {
      await transaction.rollback();
      return res.status(400).json({ mensaje: 'El número de orden de parada no puede repetirse dentro de la misma ruta.' });
    }

    // Validar paradas sin duplicados
    if (new Set(paradasIds).size !== paradasIds.length) {
      await transaction.rollback();
      return res.status(400).json({ mensaje: 'Una misma parada no puede asignarse múltiples veces a la misma ruta.' });
    }

    // Limpieza e inserción masiva (bulkCreate)
    await RutaParada.destroy({ where: { id_ruta: Number(id_ruta) }, transaction });

    const registrosNuevos = paradas.map(p => ({
      id_ruta: Number(id_ruta),
      id_parada: Number(p.id_parada),
      orden: Number(p.orden)
    }));

    await RutaParada.bulkCreate(registrosNuevos, { transaction });

    await transaction.commit();
    return res.status(200).json({ mensaje: `Se asignaron ${paradas.length} paradas a la ruta correctamente.` });
  } catch (error) {
    await transaction.rollback();
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ mensaje: 'El número de orden de parada debe ser único por ruta.' });
    }
    return res.status(500).json({ mensaje: 'Error al asignar paradas a la ruta', error: error.message });
  }
};

// Eliminar una parada específica de una ruta y ajustar las secuencias posteriores
export const eliminarParadaDeRuta = async (req, res) => {
  const { id_ruta, id_parada } = req.params;

  if (!id_ruta || isNaN(Number(id_ruta)) || !id_parada || isNaN(Number(id_parada))) {
    return res.status(400).json({ mensaje: 'Los parámetros id_ruta e id_parada deben ser numéricos válidos.' });
  }

  const transaction = await sequelize.transaction();
  try {
    const relacion = await RutaParada.findOne({ 
      where: { id_ruta: Number(id_ruta), id_parada: Number(id_parada) },
      transaction
    });

    if (!relacion) {
      await transaction.rollback();
      return res.status(404).json({ mensaje: 'La relación Ruta-Parada especificada no existe.' });
    }

    const totalParadas = await RutaParada.count({ where: { id_ruta: Number(id_ruta) }, transaction });
    if (totalParadas <= 2) {
      await transaction.rollback();
      return res.status(400).json({ mensaje: 'No se puede eliminar la parada. Una ruta debe mantener al menos 2 paradas (Origen y Destino).' });
    }

    const ordenEliminado = relacion.orden;

    await relacion.destroy({ transaction });

    // Ajustar el orden de las paradas posteriores para evitar vacíos en la secuencia
    await RutaParada.decrement('orden', {
      by: 1,
      where: {
        id_ruta: Number(id_ruta),
        orden: { [sequelize.Sequelize.Op.gt]: ordenEliminado }
      },
      transaction
    });

    await transaction.commit();
    return res.status(200).json({ mensaje: 'Parada eliminada de la ruta y secuencia reordenada correctamente.' });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ mensaje: 'Error al eliminar la parada de la ruta', error: error.message });
  }
};