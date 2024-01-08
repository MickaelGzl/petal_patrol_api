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

/**
 * Verify is user can make modifications on Data (data is user's property or user is admin)
 * @param {Object} object the Object in database the user want to modify
 * @param {User} user the user store in req.user
 * @param {boolean} AdminAuthorized can Admin access to the ressource and modify it
 * @param {string | undefined} userIdFieldName if the userId field have another name (example: for offers: ownerId)
 * @returns Object with status 404 and message if object in param is undefined
 * @returns Object with status 403 if user can't make action
 * @returns null if ok
 *
 */
export const verifyUserCanMakeAction = (
  object,
  user,
  AdminAuthorized = false,
  userIdFieldName = undefined
) => {
  if (!object) {
    return {
      status: 404,
      message: "Aucune donnée trouvée pour l'identifiant fourni.",
    };
  }

  const userIdField = userIdFieldName ? userIdFieldName : "userId";

  if (
    object[userIdField] === user.id ||
    (AdminAuthorized && user.role.includes("ADMIN"))
  ) {
    return null;
  } else {
    return { status: 403, message: "Vous n'avez pas les droits" };
  }
};
