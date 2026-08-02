export const requireRol = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user || !req.user.rol) {
      return res.status(403).json({ mensaje: 'No se pudo determinar el rol del usuario.' });
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ mensaje: 'No tiene permisos para realizar esta acción.' });
    }

    next();
  };
};
