export const ensureIsAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).json({
      message: "Vous ne pouvez pas accéder à cette ressource",
    });
  }
};
