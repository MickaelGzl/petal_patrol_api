/**
 * verify if an user is registered in req.user
 * stop request if no user authenticated
 */
export const ensureIsAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({
      message: "Vous ne pouvez pas accéder à cette ressource",
    });
  }
};

/**
 * for request that involves modificaitons or deletions in database
 * verify that the ressource concerned is created by the user who wan't modifications
 * or the user is admin
 */
export const ensureUserHaveRights = (req, res, next) => {
  if (req.params.id == req.user.id || req.user.role.includes("ADMIN")) {
    next();
  } else {
    res.status(403).json({
      message: "Vous n'avez pas les droits'",
    });
  }
};
