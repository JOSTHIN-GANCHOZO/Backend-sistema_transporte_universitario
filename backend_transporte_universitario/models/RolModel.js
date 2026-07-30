import { DataTypes } from 'sequelize';
import { sequelize } from '../db/conexion.js';

export const RolModel = sequelize.define('Rol', {
  id_rol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  descripcion: {
    type: DataTypes.STRING(255)
  }
}, {
  tableName: 'Rol',
  timestamps: false
});

export default RolModel;