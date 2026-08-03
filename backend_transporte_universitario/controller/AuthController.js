import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Usuario, Credencial, Rol } from '../models/index.js';
import { TOKEN_KEY } from '../config/config.js';

export const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || typeof correo !== 'string' || !correo.trim()) {
      return res.status(400).json({ mensaje: 'El correo es obligatorio.' });
    }

    if (!password || typeof password !== 'string' || !password.trim()) {
      return res.status(400).json({ mensaje: 'La contraseña es obligatoria.' });
    }

    const usuario = await Usuario.findOne({
      where: { correo: correo.trim().toLowerCase() },
      include: [{ model: Rol, attributes: ['id_rol', 'nombre'] }]
    });

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas.' });
    }

    const credencial = await Credencial.findOne({ where: { id_usuario: usuario.id_usuario } });
    if (!credencial) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas.' });
    }

    if (credencial.estado !== 'ACTIVA') {
      return res.status(403).json({ mensaje: `El acceso está ${credencial.estado.toLowerCase()}. Contacte al administrador.` });
    }

    const passwordCorrecta = await bcrypt.compare(password, credencial.password);
    if (!passwordCorrecta) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas.' });
    }

    const requiereCambio = credencial.ultimo_acceso === null;

    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        id_rol: usuario.id_rol,
        rol: usuario.Rol ? usuario.Rol.nombre : null,
        tipo_usuario: usuario.tipo_usuario
      },
      TOKEN_KEY,
      { expiresIn: '8h' }
    );

    await credencial.update({ ultimo_acceso: new Date() });

    const { password: _, ...datosUsuario } = usuario.toJSON();

    return res.status(200).json({
      mensaje: 'Inicio de sesión exitoso.',
      token,
      requiere_cambio: requiereCambio,
      usuario: datosUsuario
    });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
  }
};
