import { DataTypes } from 'sequelize';
import { sequelize } from '../db/conexion.js';

export const ViajeModel = sequelize.define('Viaje', {
  id_viaje: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  fecha: { 
    type: DataTypes.DATEONLY, 
    allowNull: false 
  },
  hora_salida: { 
    type: DataTypes.TIME, 
    allowNull: false 
  },
  hora_llegada_estimada: { 
    type: DataTypes.TIME 
  },
  estado: {
    type: DataTypes.ENUM('PROGRAMADO', 'EN_RECORRIDO', 'FINALIZADO', 'CANCELADO'),
    allowNull: false,
    defaultValue: 'PROGRAMADO'
  },
  cupos_disponibles: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    validate: {
      min: 0
    }
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
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: 'fecha_eliminacion',
  paranoid: true
});

export default ViajeModel;