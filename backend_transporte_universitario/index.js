import { sequelize, Usuario, Autobus } from './models/index.js';

async function main() {
  try {
    await sequelize.sync({ force: false });
    console.log('Base de datos conectada correctamente.');
  } catch (error) {
    console.error('Error al conectar la base de datos:', error);
  }
}

main();