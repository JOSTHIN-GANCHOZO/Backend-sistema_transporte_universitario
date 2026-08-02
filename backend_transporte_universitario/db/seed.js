import bcrypt from 'bcrypt';
import { sequelize, Usuario, Credencial, Rol } from '../models/index.js';
import { ADMIN_CORREO, ADMIN_PASSWORD, ADMIN_IDENTIFICACION, ADMIN_NOMBRES, ADMIN_APELLIDOS } from '../config/config.js';

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL establecida.');

    await sequelize.sync();
    console.log('✅ Tablas sincronizadas.');

    let rolAdmin = await Rol.findOne({ where: { nombre: 'ADMINISTRADOR' } });
    if (!rolAdmin) {
      rolAdmin = await Rol.create({ nombre: 'ADMINISTRADOR', descripcion: 'Administrador del sistema' });
      console.log('✅ Rol ADMINISTRADOR creado.');
    } else {
      console.log('ℹ️  El rol ADMINISTRADOR ya existe.');
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

    console.log(`\n🔐 Acceso inicial: ${ADMIN_CORREO.toLowerCase()} / ${ADMIN_PASSWORD}`);
    await sequelize.close();
    console.log('✅ Seed completado.');
  } catch (error) {
    console.error('❌ Error en el seed:', error);
    process.exit(1);
  }
}

seed();
