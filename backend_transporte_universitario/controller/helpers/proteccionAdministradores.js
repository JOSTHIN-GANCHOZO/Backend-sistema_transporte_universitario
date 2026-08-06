import { Usuario, Rol, Credencial, sequelize } from '../../models/index.js';
import { ADMIN_CORREO } from '../../config/config.js';

const esAdministradorPrincipal = (correo) =>
  Boolean(ADMIN_CORREO) && correo?.trim().toLowerCase() === ADMIN_CORREO.trim().toLowerCase();

const esUltimoAdministradorActivo = async (idExcluido) => {
  const cantidad = await Usuario.count({
    where: { id_usuario: { [sequelize.Sequelize.Op.ne]: idExcluido } },
    include: [
      { model: Rol, where: { nombre: 'ADMINISTRATIVO' } },
      { model: Credencial, where: { estado: 'ACTIVA' }, required: true }
    ]
  });
  return cantidad === 0;
};

const obtenerRolUsuario = async (usuario) => {
  if (usuario.Rol) return usuario.Rol;
  return usuario.getRol();
};

// Devuelve 'propia' | 'principal' | 'ultimo' | null
export const motivoBloqueoGestion = async (usuario, idUsuarioActual) => {
  const rol = await obtenerRolUsuario(usuario);
  if (!rol || rol.nombre !== 'ADMINISTRATIVO') return null;

  if (Number(usuario.id_usuario) === Number(idUsuarioActual)) return 'propia';
  if (esAdministradorPrincipal(usuario.correo)) return 'principal';
  if (await esUltimoAdministradorActivo(usuario.id_usuario)) return 'ultimo';

  return null;
};

export const mensajeMotivoBloqueo = (motivo, accion) => {
  if (motivo === 'propia') return `No puedes ${accion} tu propia cuenta.`;
  if (motivo === 'principal') return `No se puede ${accion} al administrador principal del sistema.`;
  if (motivo === 'ultimo') return 'El sistema debe conservar al menos un administrador activo.';
  return null;
};