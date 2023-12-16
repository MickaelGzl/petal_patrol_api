export const ensureIsAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).json({
      message: "Vous ne pouvez pas accéder à cette ressource",
    });
  }
};

export const ensureUserHaveRights = (req, res, next) => {
  if (req.params.id == req.user.id || req.user.role.includes("ADMIN")) {
    next();
  } else {
    res.status(403).json({
      message: "Vous n'avez pas les droits'",
    });
  }
};
