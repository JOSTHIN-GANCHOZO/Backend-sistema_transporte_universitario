import { DataTypes } from 'sequelize';
import { sequelize } from '../db/conexion.js';

export const ReservaModel = sequelize.define('Reserva', {
  id_reserva: { 
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
   },
  fecha: {
     type: DataTypes.DATEONLY,
     allowNull: false, 
     defaultValue: DataTypes.NOW
     },
  numero_asiento: { 
    type: DataTypes.INTEGER, 
    allowNull: false
   },
  estado: {
    type: DataTypes.ENUM('PENDIENTE', 'CONFIRMADA', 'UTILIZADA', 'CANCELADA'),
    allowNull: false
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Usuario', key: 'id_usuario' }
  },
  id_viaje: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Viaje', key: 'id_viaje' }
  }
}, {
  tableName: 'Reserva',
  timestamps: false
});

export default ReservaModel;