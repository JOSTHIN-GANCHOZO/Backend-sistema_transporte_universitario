import { DataTypes } from 'sequelize';
import { sequelize } from '../db/conexion.js';

export const MantenimientoModel = sequelize.define('Mantenimiento', {
  id_mantenimiento: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  fecha_inicio: { 
    type: DataTypes.DATEONLY, 
    allowNull: false 
  },
  fecha_fin: { 
    type: DataTypes.DATEONLY
   },
  tipo_mantenimiento: { 
    type: DataTypes.STRING(100) 
  },
  descripcion: { 
    type: DataTypes.TEXT 
  },
  costo: { 
    type: DataTypes.DECIMAL(10, 2) },
  estado: { 
    type: DataTypes.STRING(50) 
  },
  id_autobus: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Autobus', key: 'id_autobus' }
  }
}, {
  tableName: 'Mantenimiento',
  timestamps: false
});

export default MantenimientoModel;