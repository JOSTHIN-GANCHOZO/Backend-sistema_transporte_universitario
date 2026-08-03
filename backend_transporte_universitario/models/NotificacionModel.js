import { DataTypes } from 'sequelize';
import { sequelize } from '../db/conexion.js';

export const NotificacionModel = sequelize.define('Notificacion', {
  id_notificacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Usuario',
      key: 'id_usuario'
    }
  },
  titulo: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  leido: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'Notificacion',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: false,
  deletedAt: 'fecha_eliminacion',
  paranoid: true
});

export default NotificacionModel;