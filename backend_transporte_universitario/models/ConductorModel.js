import { DataTypes } from 'sequelize';
import { sequelize } from '../db/conexion.js';

export const ConductorModel = sequelize.define('Conductor', {
  id_conductor: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true
   },
  identificacion: { 
    type: DataTypes.STRING(20), 
    allowNull: false
   },
  nombres: { type: DataTypes.STRING(100), 
    allowNull: false
   },
  apellidos: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  telefono: { 
    type: DataTypes.STRING(20)
   },
  correo: { 
    type: DataTypes.STRING(100)
   },
  numero_licencia: { 
    type: DataTypes.STRING(50), 
    allowNull: false 
  },
  fecha_vencimiento_licencia: { 
    type: DataTypes.DATEONLY, 
    allowNull: false }
}, 
{tableName: 'Conductor',
  timestamps: false
}
  
);

export default ConductorModel;