import jwt from "jsonwebtoken";
import { Usuario, Credencial, Rol } from "../models/index.js";
import { TOKEN_KEY } from "../config/config.js";

export const verifyToken = async (req, res, next) => {
  const tokenHeader = req.header('Authorization');

  if (!tokenHeader || !tokenHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'No autorizado.' });
  }

  const token = tokenHeader.split(' ')[1];

  try {
    const user = jwt.verify(token, TOKEN_KEY);
    req.user = user;

    // Revalidar en BD que el usuario siga activo y su credencial no esté bloqueada/inactiva
    const usuario = await Usuario.findByPk(user.id_usuario, {
      include: [{ model: Rol, attributes: ['id_rol', 'nombre'] }]
    });
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Token inválido.' });
    }

    const credencial = await Credencial.findOne({ where: { id_usuario: user.id_usuario } });
    if (!credencial || credencial.estado !== 'ACTIVA') {
      return res.status(401).json({ mensaje: 'Token inválido.' });
    }

    // Refrescar datos de autorización desde BD para que cambios de rol/flags sean inmediatos
    req.user.id_rol = usuario.id_rol;
    req.user.correo = usuario.correo;
    req.user.es_admin_principal = usuario.es_admin_principal;
    req.user.rol = usuario.Rol ? usuario.Rol.nombre : null;

    next();
  } catch (err) {
    return res.status(401).json({ mensaje: 'Token inválido.' });
  }
};