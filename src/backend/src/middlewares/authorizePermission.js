function authorizePermission(...permissoesRequeridas) {
  return (req, res, next) => {
    const userPermissions = req.user?.permissoes || [];

    const hasPermission = permissoesRequeridas.some(p => userPermissions.includes(p));

    if (!req.user || !hasPermission) {
      return res.status(403).json({ erro: 'Acesso negado. Você não tem a permissão necessária.' });
    }
    next();
  };
}

module.exports = authorizePermission;