import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ValidationError, UniqueConstraintError } from 'sequelize';
import router from './router/index.js';
import { CORS_ORIGIN } from './config/config.js';

const app = express();

// Seguridad: cabeceras HTTP seguras
app.use(helmet());

// CORS restringido a orígenes permitidos
app.use(cors({
  origin: CORS_ORIGIN ? CORS_ORIGIN.split(',').map(origen => origen.trim()) : true
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use('/api', router);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada.' });
});

// Manejador de errores global (debe ir al final, después de todas las rutas)
app.use((error, req, res, next) => {
  console.error('❌ Error no controlado:', error);

  if (error instanceof ValidationError || error instanceof UniqueConstraintError) {
    return res.status(400).json({ mensaje: 'Error de validación de datos.', errores: error.errors });
  }

  if (process.env.NODE_ENV !== 'production') {
    return res.status(500).json({ mensaje: 'Error interno del servidor.', error: error.message });
  }

  return res.status(500).json({ mensaje: 'Error interno del servidor.' });
});

export default app;
