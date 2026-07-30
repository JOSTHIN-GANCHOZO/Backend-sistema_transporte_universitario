import { DataTypes } from 'sequelize';
import { sequelize } from '../db/conexion.js';

export const CredencialModel = sequelize.define('Credencial', {
  id_credencial: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // Asegura que sea una relación 1 a 1 exacta
    references: {
      model: 'Usuario',
      key: 'id_usuario'
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'Credencial',
  timestamps: false
});

export default CredencialModel;