import app from './app.js';
import { sequelize } from './models/index.js';

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {

    try {
        // Verificar conexión
        await sequelize.authenticate();
        console.log('✅ Conexión a MySQL establecida.');
        // Sincronizar modelos sin alter para no crear índices duplicados.
        await sequelize.sync({ alter: true });

        console.log('✅ Modelos sincronizados.');
        // Levantar servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor');
        console.error(error);
    }
}

iniciarServidor();