import { DataTypes } from 'sequelize';
import { sequelize } from '../db/conexion.js';

export const AutobusConductorModel = sequelize.define('Autobus_Conductor', {
  id_autobus: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: { model: 'Autobus', key: 'id_autobus' }
  },
  id_conductor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: { model: 'Conductor', key: 'id_conductor' }
  },
  horario: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'Autobus_Conductor',
  timestamps: false
});

export default AutobusConductorModel;