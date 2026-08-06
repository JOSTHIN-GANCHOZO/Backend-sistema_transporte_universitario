import { Sequelize } from 'sequelize';
import {DB_CONNECTION, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_DATABASE, DB_PORT} from '../config/config.js';
export const sequelize = new Sequelize(
    DB_DATABASE,
    DB_USERNAME,
    DB_PASSWORD,
    {
        host: DB_HOST,
        port: DB_PORT ? Number(DB_PORT) : undefined,
        dialect: DB_CONNECTION
    }
);
















