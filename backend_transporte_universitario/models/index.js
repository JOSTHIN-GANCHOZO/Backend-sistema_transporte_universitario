import { sequelize } from '../db/conexion.js';

import Usuario from './UsuarioModel.js';
import Autobus from './AutobusModel.js';
import Conductor from './ConductorModel.js';
import AutobusConductor from './AutobusConductorModel.js';
import Mantenimiento from './MantenimientoModel.js';
import Ruta from './RutaModel.js';
import Parada from './ParadaModel.js';
import RutaParada from './RutaParadaModel.js';
import Viaje from './ViajeModel.js';
import Reserva from './ReservaModel.js';
import Rol from './RolModel.js';
import Credencial from './CredencialModel.js';
import Notificacion from './NotificacionModel.js';
import Permiso from './PermisosModel.js';


//Rol - Usuario  de 1 a muchos  
Rol.hasMany(Usuario, { foreignKey: 'id_rol' });
Usuario.belongsTo(Rol, { foreignKey: 'id_rol' });

//Usuario - Credencial de 1 a 1
Usuario.hasOne(Credencial, { foreignKey: 'id_usuario' });
Credencial.belongsTo(Usuario, { foreignKey: 'id_usuario' });

//Usuario - Notificaciones de 1 a muchos
Usuario.hasMany(Notificacion, { foreignKey: 'id_usuario' });
Notificacion.belongsTo(Usuario, { foreignKey: 'id_usuario' });

// Relación Autobus - Mantenimientos
Autobus.hasMany(Mantenimiento, { foreignKey: 'id_autobus' });
Mantenimiento.belongsTo(Autobus, { foreignKey: 'id_autobus' });

// Relación Autobus - Conductor (tabla intermedia)
AutobusConductor.belongsTo(Autobus, { foreignKey: 'id_autobus' });
AutobusConductor.belongsTo(Conductor, { foreignKey: 'id_conductor' });

Autobus.belongsToMany(Conductor, { 
  through: AutobusConductor, 
  foreignKey: 'id_autobus',
  otherKey: 'id_conductor' 
});
Conductor.belongsToMany(Autobus, { 
  through: AutobusConductor, 
  foreignKey: 'id_conductor',
  otherKey: 'id_autobus' 
});

// Relación Ruta - Parada
RutaParada.belongsTo(Parada, { foreignKey: 'id_parada' });
RutaParada.belongsTo(Ruta, { foreignKey: 'id_ruta', as: 'Ruta' });

Ruta.belongsToMany(Parada, { 
  through: RutaParada, 
  foreignKey: 'id_ruta',
  otherKey: 'id_parada' 
});
Parada.belongsToMany(Ruta, { 
  through: RutaParada, 
  foreignKey: 'id_parada',
  otherKey: 'id_ruta' 
});

// Relaciones con Viaje
Ruta.hasMany(Viaje, { foreignKey: 'id_ruta' });
Viaje.belongsTo(Ruta, { foreignKey: 'id_ruta', as: 'Ruta' });

Autobus.hasMany(Viaje, { foreignKey: 'id_autobus' });
Viaje.belongsTo(Autobus, { foreignKey: 'id_autobus' });

Conductor.hasMany(Viaje, { foreignKey: 'id_conductor' });
Viaje.belongsTo(Conductor, { foreignKey: 'id_conductor' });

// Relaciones con Reserva
Usuario.hasMany(Reserva, { foreignKey: 'id_usuario' });
Reserva.belongsTo(Usuario, { foreignKey: 'id_usuario' });

Viaje.hasMany(Reserva, { foreignKey: 'id_viaje' });
Reserva.belongsTo(Viaje, { foreignKey: 'id_viaje' });

Rol.belongsToMany(Permiso, {
    through: 'Rol_Permiso',
    foreignKey: 'id_rol',
    otherKey: 'id_permiso'
});

Permiso.belongsToMany(Rol, {
    through: 'Rol_Permiso',
    foreignKey: 'id_permiso',
    otherKey: 'id_rol'
});

export {
  sequelize,
  Usuario,
  Autobus,
  Conductor,
  AutobusConductor,
  Mantenimiento,
  Ruta,
  Parada,
  RutaParada,
  Viaje,
  Reserva,
  Rol,
  Credencial,
  Notificacion,
  Permiso
};