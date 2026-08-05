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
    unique: true, 
    references: {
      model: 'Usuario',
      key: 'id_usuario'
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('ACTIVA', 'BLOQUEADA', 'INACTIVA'),
    allowNull: false,
    defaultValue: 'ACTIVA'
  },
  debe_cambiar_password: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  ultimo_acceso: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'Credencial',
  timestamps: false
});

export default CredencialModel;