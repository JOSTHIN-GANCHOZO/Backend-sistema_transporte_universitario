import { DataTypes } from 'sequelize';
import { sequelize } from '../db/conexion.js';

export const RutaModel = sequelize.define('Ruta', {
  id_ruta: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true },
  codigo: { 
    type: DataTypes.STRING(20), 
    allowNull: false
  },
  nombre: { 
    type: DataTypes.STRING(100), 
    allowNull: false
   },
  origen: { 
    type: DataTypes.STRING(150), 
    allowNull: false 
  },
  destino: { 
    type: DataTypes.STRING(150), 
    allowNull: false
  },
  distancia_estimada: { 
    type: DataTypes.DECIMAL(8, 2) },
  duracion_aproximada: { 
    type: DataTypes.TIME }
}, {
  tableName: 'Ruta',
  timestamps: false
});

export default RutaModel;