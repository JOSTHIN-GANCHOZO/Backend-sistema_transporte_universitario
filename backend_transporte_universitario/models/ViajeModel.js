import { DataTypes } from 'sequelize';
import { sequelize } from '../db/conexion.js';

export const ViajeModel = sequelize.define('Viaje', {
  id_viaje: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  hora_salida: { type: DataTypes.TIME, allowNull: false },
  hora_llegada_estimada: { type: DataTypes.TIME },
  estado: {
    type: DataTypes.ENUM('PROGRAMADO', 'EN_RECORRIDO', 'FINALIZADO', 'CANCELADO'),
    allowNull: false
  },
  cupos_disponibles: { 
    type: DataTypes.INTEGER, 
    allowNull: false
   },
  id_ruta: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Ruta', key: 'id_ruta' }
  },
  id_autobus: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Autobus', key: 'id_autobus' }
  },
  id_conductor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Conductor', key: 'id_conductor' }
  }
}, {
  tableName: 'Viaje',
  timestamps: false
});

export default ViajeModel;