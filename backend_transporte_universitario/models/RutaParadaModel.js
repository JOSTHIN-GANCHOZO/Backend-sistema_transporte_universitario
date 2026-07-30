import { DataTypes } from 'sequelize';
import { sequelize } from '../db/conexion.js';

export const RutaParadaModel = sequelize.define('Ruta_Parada', {
  id_ruta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: { model: 'Ruta', key: 'id_ruta' }
  },
  id_parada: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: { model: 'Parada', key: 'id_parada' }
  },
  orden: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'Ruta_Parada',
  timestamps: false
});

export default RutaParadaModel;