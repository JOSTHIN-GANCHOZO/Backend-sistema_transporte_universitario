import { DataTypes } from 'sequelize';
import { sequelize } from '../db/conexion.js';

export const AutobusModel = sequelize.define('Autobus', {
  id_autobus: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  placa: { 
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true 
  },
  numero_interno: { 
    type: DataTypes.STRING(20), 
    allowNull: false,
    unique: true 
  },
  marca: { 
    type: DataTypes.STRING(50)
  },
  modelo: { 
    type: DataTypes.STRING(50) },
  año: { type: DataTypes.INTEGER 
    
  },
  capacidad_maxima: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    validate: {
      min: 1
    }
  },
  estado: {
    type: DataTypes.ENUM('DISPONIBLE', 'EN_SERVICIO', 'EN_MANTENIMIENTO', 'FUERA_DE_SERVICIO'),
    allowNull: false
  }
}, {
  tableName: 'Autobus',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: 'fecha_eliminacion',
  paranoid: true
});

export default AutobusModel;