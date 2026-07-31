import { DataTypes } from 'sequelize';
import { sequelize } from '../db/conexion.js';

export const PermisoModel = sequelize.define('Permiso', {
  id_permiso: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  descripcion: {
    type: DataTypes.STRING(200)
  }
}, {
  tableName: 'Permiso',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: 'fecha_eliminacion',
  paranoid: true
});

export default PermisoModel;