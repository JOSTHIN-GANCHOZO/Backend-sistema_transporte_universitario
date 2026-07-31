import { DataTypes } from 'sequelize';
import { sequelize } from '../db/conexion.js';

export const MantenimientoModel = sequelize.define('Mantenimiento', {
  id_mantenimiento: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  fecha_inicio: { 
    type: DataTypes.DATEONLY, 
    allowNull: false 
  },
  fecha_fin: { 
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isAfterOrEqualFechaInicio(value) {
        if (value && this.fecha_inicio && new Date(value) < new Date(this.fecha_inicio)) {
          throw new Error('La fecha de fin no puede ser anterior a la fecha de inicio.');
        }
      }
    }
  },
  tipo_mantenimiento: { 
    type: DataTypes.STRING(100) 
  },
  descripcion: { 
    type: DataTypes.TEXT 
  },
  costo: { 
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  estado: { 
    type: DataTypes.ENUM('PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'CANCELADO'),
    allowNull: false,
    defaultValue: 'EN_PROCESO'
  },
  id_autobus: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Autobus', key: 'id_autobus' }
  }
}, {
  tableName: 'Mantenimiento',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: 'fecha_eliminacion',
  paranoid: true
});

export default MantenimientoModel;