import { Usuario, Credencial, sequelize } from '../../models/index.js';

const esUltimoAdministradorPrincipalActivo = async (idExcluido) => {
  const cantidad = await Usuario.count({
    where: {
      id_usuario: { [sequelize.Sequelize.Op.ne]: idExcluido },
      es_admin_principal: true
    },
    include: [
      { model: Credencial, where: { estado: 'ACTIVA' }, required: true }
    ]
  });
  return cantidad === 0;
};

// Devuelve 'propia' | 'ultimo' | null
export const motivoBloqueoGestion = async (usuario, idUsuarioActual) => {
  if (usuario.es_admin_principal !== true) return null;

  if (Number(usuario.id_usuario) === Number(idUsuarioActual)) return 'propia';
  if (await esUltimoAdministradorPrincipalActivo(usuario.id_usuario)) return 'ultimo';

  return null;
};

export const mensajeMotivoBloqueo = (motivo, accion) => {
  if (motivo === 'propia') return `No puedes ${accion} tu propia cuenta.`;
  if (motivo === 'ultimo') return 'El sistema debe conservar al menos un administrador principal activo.';
  return null;
};
