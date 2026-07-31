import { DataTypes } from 'sequelize';
import { sequelize } from '../db/conexion.js';

export const UsuarioModel = sequelize.define('Usuario', {
  id_usuario: { 
    autoIncrement: true, 
    primaryKey: true, 
    type: DataTypes.INTEGER 
  },
  identificacion: { 
    type: DataTypes.STRING(20), 
    allowNull: false,
    unique: true 
  },
  nombres: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  apellidos: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  correo: { 
    type: DataTypes.STRING(100), 
    allowNull: false, 
    unique: true,
    validate: {
      isEmail: true
    }
  },
  telefono: { 
    type: DataTypes.STRING(20)
  },
  tipo_usuario: {
    type: DataTypes.ENUM('ESTUDIANTE', 'DOCENTE', 'ADMINISTRATIVO'),
    allowNull: false
  },
  id_rol: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Rol',
      key: 'id_rol'
    }
  }
}, {
  tableName: 'Usuario',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: 'fecha_eliminacion',
  paranoid: true
});

export default UsuarioModel;