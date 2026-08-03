import jwt from "jsonwebtoken";
import { Usuario, Credencial } from "../models/index.js";
import { TOKEN_KEY } from "../config/config.js";

export const verifyToken = async (req, res, next) => {
  const tokenHeader = req.header('Authorization');

  if (!tokenHeader || !tokenHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = tokenHeader.split(' ')[1];

  try {
    const user = jwt.verify(token, TOKEN_KEY);
    req.user = user;

    // Revalidar en BD que el usuario siga activo y su credencial no esté bloqueada/inactiva
    const usuario = await Usuario.findByPk(user.id_usuario);
    if (!usuario) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const credencial = await Credencial.findOne({ where: { id_usuario: user.id_usuario } });
    if (!credencial || credencial.estado !== 'ACTIVA') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};