import { DataTypes } from 'sequelize';
import { sequelize } from '../db/conexion.js';

export const ParadaModel = sequelize.define('Parada', {
  id_parada: {
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true
  },
  codigo: { 
    type: DataTypes.STRING(20), 
    allowNull: false,
    unique: true // Evita códigos duplicados a nivel de base de datos
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  direccion: {
    type: DataTypes.STRING(200)
  },
  ubicacion_referencia: { 
    type: DataTypes.STRING(200) 
  }
}, {
  tableName: 'Parada',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: 'fecha_eliminacion',
  paranoid: true
});

export default ParadaModel;