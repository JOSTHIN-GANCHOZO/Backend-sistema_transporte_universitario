import bcrypt from 'bcrypt';
import { sequelize, Usuario, Credencial, Rol } from '../models/index.js';
import { ADMIN_CORREO, ADMIN_PASSWORD, ADMIN_IDENTIFICACION, ADMIN_NOMBRES, ADMIN_APELLIDOS } from '../config/config.js';

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL establecida.');

    await sequelize.sync();
    console.log('✅ Tablas sincronizadas.');

    let rolAdmin = await Rol.findOne({ where: { nombre: 'ADMINISTRATIVO' } });
    if (!rolAdmin) {
      const rolAntiguo = await Rol.findOne({ where: { nombre: 'ADMINISTRADOR' } });
      if (rolAntiguo) {
        await rolAntiguo.update({ nombre: 'ADMINISTRATIVO' });
        rolAdmin = rolAntiguo;
        console.log('✅ Rol ADMINISTRADOR renombrado a ADMINISTRATIVO.');
      } else {
        rolAdmin = await Rol.create({ nombre: 'ADMINISTRATIVO', descripcion: 'Administrativo del sistema' });
        console.log('✅ Rol ADMINISTRATIVO creado.');
      }
    } else {
      console.log('ℹ️  El rol ADMINISTRATIVO ya existe.');
    }

    let rolPasajero = await Rol.findOne({ where: { nombre: 'PASAJERO' } });
    if (!rolPasajero) {
      rolPasajero = await Rol.create({ nombre: 'PASAJERO', descripcion: 'Pasajero del transporte universitario' });
      console.log('✅ Rol PASAJERO creado.');
    } else {
      console.log('ℹ️  El rol PASAJERO ya existe.');
    }

    // Normalizar roles: solo deben quedar PASAJERO y ADMINISTRATIVO
    const rolesValidos = ['PASAJERO', 'ADMINISTRATIVO'];
    const rolesSobrantes = await Rol.findAll({ where: { nombre: { [sequelize.Sequelize.Op.notIn]: rolesValidos } } });
    if (rolesSobrantes.length > 0) {
      const usuariosSobrantes = await Usuario.findAll({
        where: { id_rol: rolesSobrantes.map((r) => r.id_rol) }
      });
      for (const usuario of usuariosSobrantes) {
        await usuario.update({ id_rol: rolPasajero.id_rol });
      }
      if (usuariosSobrantes.length > 0) {
        console.log(`↔️ ${usuariosSobrantes.length} usuario(s) reasignado(s) al rol PASAJERO.`);
      }
      for (const rol of rolesSobrantes) {
        await rol.destroy();
        console.log(`🗑️  Rol ${rol.nombre} eliminado (solo se permiten PASAJERO y ADMINISTRATIVO).`);
      }
    }

    if (!ADMIN_CORREO || !ADMIN_PASSWORD) {
      console.error('❌ Debe definir ADMIN_CORREO y ADMIN_PASSWORD en el archivo .env');
      process.exit(1);
    }

    let admin = await Usuario.findOne({ where: { correo: ADMIN_CORREO.toLowerCase() } });
    if (!admin) {
      admin = await Usuario.create({
        identificacion: ADMIN_IDENTIFICACION || '0000000000',
        nombres: ADMIN_NOMBRES || 'Administrador',
        apellidos: ADMIN_APELLIDOS || 'del Sistema',
        correo: ADMIN_CORREO.toLowerCase(),
        tipo_usuario: 'ADMINISTRATIVO',
        id_rol: rolAdmin.id_rol
      });
      console.log('✅ Usuario administrador creado.');
    } else {
      console.log('ℹ️  El usuario administrador ya existe.');
    }

    const credencialExistente = await Credencial.findOne({ where: { id_usuario: admin.id_usuario } });
    if (!credencialExistente) {
      const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await Credencial.create({
        id_usuario: admin.id_usuario,
        password: passwordHash,
        estado: 'ACTIVA'
      });
      console.log('✅ Credencial del administrador creada (contraseña cifrada).');
    } else {
      console.log('ℹ️  La credencial del administrador ya existe. No se modifica la contraseña.');
    }

    console.log(`\n🔐 Usuario administrador listo: ${ADMIN_CORREO.toLowerCase()}. La contraseña es la definida en el archivo .env.`);
    await sequelize.close();
    console.log('✅ Seed completado.');
  } catch (error) {
    console.error('❌ Error en el seed:', error);
    process.exit(1);
  }
}

seed();
