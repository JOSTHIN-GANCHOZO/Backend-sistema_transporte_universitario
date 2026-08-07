import * as dotenv from 'dotenv';
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || process.env.MYSQL_URL;

function datosConexion() {
  if (DATABASE_URL) {
    try {
      const u = new URL(DATABASE_URL);
      return {
        DB_HOST: u.hostname,
        DB_PORT: u.port || '3306',
        DB_DATABASE: decodeURIComponent(u.pathname.replace(/^\//, '')),
        DB_USERNAME: decodeURIComponent(u.username),
        DB_PASSWORD: decodeURIComponent(u.password)
      };
    } catch (error) {
      console.error('⚠️ DATABASE_URL inválida, se usarán las variables individuales.', error.message);
    }
  }

  return {
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || '3306',
    DB_DATABASE: process.env.DB_DATABASE || '',
    DB_USERNAME: process.env.DB_USERNAME || '',
    DB_PASSWORD: process.env.DB_PASSWORD || ''
  };
}

const { DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD } = datosConexion();

export const DB_CONNECTION = process.env.DB_CONNECTION || 'mysql';
export { DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD };
export const CORS_ORIGIN = process.env.CORS_ORIGIN;
export const TOKEN_KEY = process.env.TOKEN_KEY;
export const ADMIN_CORREO = process.env.ADMIN_CORREO;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
export const ADMIN_IDENTIFICACION = process.env.ADMIN_IDENTIFICACION;
export const ADMIN_NOMBRES = process.env.ADMIN_NOMBRES;
export const ADMIN_APELLIDOS = process.env.ADMIN_APELLIDOS;



