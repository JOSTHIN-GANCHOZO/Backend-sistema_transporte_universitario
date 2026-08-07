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

// Solo el rol ADMINISTRATIVO con flag es_admin_principal puede ejecutar operaciones de gestión
export const requireAdminPrincipal = (req, res, next) => {
  if (!req.user || req.user.rol !== 'ADMINISTRATIVO' || req.user.es_admin_principal !== true) {
    return res.status(403).json({ mensaje: 'No tiene permisos para realizar esta acción.' });
  }

  next();
};
