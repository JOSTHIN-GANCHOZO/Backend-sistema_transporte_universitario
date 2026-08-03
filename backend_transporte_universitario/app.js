import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './router/index.js';
import { CORS_ORIGIN } from './config/config.js';

const app = express();

// Seguridad: cabeceras HTTP seguras
app.use(helmet());

// CORS restringido a orígenes permitidos
app.use(cors({
  origin: CORS_ORIGIN ? CORS_ORIGIN.split(',') : true
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use('/api', router);

export default app;
