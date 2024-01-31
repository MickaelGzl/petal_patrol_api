import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { deleteFile, fileUploadConfig } from "../config/multerConfig.js";
import { findRoleByName, findRoleByUserId } from "../queries/roleQueries.js";
import {
  createUser,
  findUserByEmail,
  comparePasswords,
  findAllUser,
  findUserById,
  updateUser,
  hashPassword,
  findUserByToken,
  updateAvatar,
  validUser,
} from "../queries/userQueries.js";
import {
  createTokenFromSecret,
  validateTokenWithSecret,
} from "../config/csrfConfig.js";
import { emailFactory } from "../mailer/index.js";
import { createWaitingBotanist } from "../queries/waitingBotanistQueries.js";
// import { verifyUserCanMakeAction } from "../config/authConfig.js";

dotenv.config();
const upload = fileUploadConfig("users");
/**
 * create a new user. email have to be unique.
 * verify if user registered as user or as botanist, in function, send email verification mail or notification to administrator with botanist message
 *@returns name and email of the new registered user
 */
export const userCreate = async (req, res) => {
  let message;
  try {
    const { name, email, password, isBotanist, siret } = req.body;
    const emailAlreadyInUse = await findUserByEmail(email, ["email"]);
    if (emailAlreadyInUse) {
      message = "Cet email est déjà utilisé.";
      return res.status(409).json({ message });
    }
    const userRole = await findRoleByName(isBotanist ? "BOTANIST" : "USER");
    const infoUser = isBotanist
      ? { email, password, name, siret }
      : { email, password, name };
    const user = await createUser(infoUser, userRole);

    if (isBotanist) {
      await createWaitingBotanist(user.id, req.body.message);
      message =
        "Enregistré avec succès. En attente de validation de l'administrateur";
    } else {
      const token = createTokenFromSecret(process.env.CSRF_SECRET);
      emailFactory.sendEmailVerificationLink({
        to: req.body.email,
        url: `${req.protocol}://${req.get("host")}`,
        token: user.activation_token,
        serverToken: token,
      });
      message =
        "Enregistré avec succès. Veuillez vérifier vos mails afin de valider votre compte avant de vous connecter.";
    }

    res.json({
      message,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("<userController: userCreate>", error);
    message = "Erreur lors de la création de l'utilisateur.";
    res.status(500).json({ message });
  }
};

/**
 * log user by vérifying email and password
 * update user log date and deleteOn
 *@returns connecting user and his roles
 */
export const userSignIn = async (req, res) => {
  let message;
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email, [
      "id",
      "name",
      "email",
      "password",
      "avatar",
      "validate_account",
    ]);
    if (!user) {
      message = "Identifiant ou mot de passe incorrect.";
      return res.status(404).json({ message });
    }
    const validPassword = await comparePasswords(password, user.password);
    if (!validPassword) {
      message = "Identifiant ou mot de passe incorrect.";
      return res.status(404).json({ message });
    }

    const userRoles = (await findRoleByUserId(user.id)).map(
      (role) => role.role
    );
    if (!user.validate_account) {
      message = userRoles.includes("BOTANIST")
        ? "Votre compte n'a pas encore été validé par l'administrateur"
        : "Vous devez valider votre mail pour continuer sur l'application.";
      return res.status(403).json({ message });
    }
    // if (userRoles.includes("BOTANIST") && user.validate_account === false) {
    //   message = "Votre compte n'a pas encore été validé par l'administrateur";
    //   return res.status(403).json({ message });
    // }
    req.login(user);
    user.lastLog = new Date(Date.now());
    user.deletedOn = null;
    await user.save();
    message = "Connexion réussi.";
    return res.json({
      message,
      user: { ...user.dataValues, password: "", roles: userRoles },
    });
  } catch (error) {
    console.error("<userController: userSignIn>", error);
    message = "Erreur lors de la connexion de l'utilisateur.";
    return res.status(500).json({ message });
  }
};

/**
 * simple function to disconnect user. Just remove jwt cookie
 * user logout function create earlier in addJwtFeature
 */
export const userSignOut = (req, res) => {
  let message;
  try {
    req.logout();
    message = "Déconnexion réussi.";
    res.json({ message });
  } catch (error) {
    console.error("<userController: userSignOut>", error);
    message = "Erreur lors de la déconnexion de l'utilisateur.";
    res.status(500).json({ message });
  }
};

/**
 * validate user email when clicking on email link
 * verify the validity of the token and valid user account
 */
export const userValidateEmail = async (req, res) => {
  let message;
  try {
    if (
      !req.params.serverToken ||
      !req.params.token ||
      !validateTokenWithSecret(process.env.CSRF_SECRET, req.params.serverToken)
    ) {
      message = "Token invalide";
      // return res.status(401).json({ message });
      return res.render("confirmEmailValidation", { message });
    }
    const user = await findUserByToken(req.params.token);
    if (!user) {
      message = "Aucun utilisateur pour l'identifiant fournis.";
      // return res.status(404).json({ message });
      return res.render("confirmEmailValidation", { message });
    }
    await validUser(user);
    message =
      "Le compte est désormais valide. Vous pouvez vous connecter sur l'application";
    // return res.json({ message });
    return res.render("confirmEmailValidation", { message });
  } catch (error) {
    console.error("<userController: userValidateEmail>", error);
    message = "Erreur lors de la validation de l'email de l'utilisateurs.";
    // res.status(500).json({ message });
    return res.render("confirmEmailValidation", { message });
  }
};

/**
 * find all users, also can query name and role
 * only admin can access to this request
 *@returns all user registered in application and their roles
 */
export const userFindAll = async (req, res) => {
  let message;
  try {
    const allUsers = await findAllUser(req.query);
    message = "La liste des utilisateurs à bien été récupérée.";

    res.json({
      message,
      users: allUsers.map(({ dataValues }) => {
        return {
          ...dataValues,
          roles: dataValues.roles.map((role) => role.role),
        };
      }),
    });
  } catch (error) {
    console.error("<userController: userFindAll>", error);
    message = "Erreur lors de la récupération de la liste des utilisateurs.";
    res.status(500).json({ message });
  }
};

/**
 * find specific user by id
 *@returns user name, avatar and siret
 *@returns to admin, also send email, and info like account is valid, last logging date and date of deletion
 */
export const userFindOne = async (req, res) => {
  let message;
  try {
    const isAdmin = req.user.role.includes("ADMIN");
    let attributes = ["id", "name", "avatar", "siret"];
    if (isAdmin) {
      attributes = [
        ...attributes,
        "email",
        "validate_account",
        "deletedOn",
        "lastLog",
      ];
    }
    let user = await findUserById(req.params.id, attributes);
    if (!user) {
      message = "Aucun utilisateur correspondant à l'identifiant fourni.";
      return res.status(404).json({ message, id: req.params.id });
    }
    if (isAdmin) {
      const userRoles = (await findRoleByUserId(user.id)).map(
        (role) => role.role
      );
      user = { ...user.dataValues, roles: userRoles };
    }
    message = `Un utilisateur à bien été récupéré.`;
    res.json({ message, user });
  } catch (error) {
    console.error("<userController: userFindOne>", error);
    message = "Erreur lors de la récupération de l'utilisateur.";
    res.status(500).json({ message });
  }
};

/**
 * update user name.
 * Only own user can update his username, or admin can do it if user name isn't appropriated.
 * @returns id and new name of user modified
 */
export const userUpdateName = async (req, res) => {
  let message;
  try {
    const user = await findUserById(req.params.id);
    if (!user) {
      message = "Aucun utilisateur correspondant à l'identifiant fourni.";
      return res.status(404).json({ message, id: req.params.id });
    }
    const { name, validate_account } = req.body;

    if (validate_account !== undefined && !req.user.role.includes("ADMIN")) {
      message = "Vous n'avez pas les droits";
      return res.status(403).json({ message });
    }

    const updatedUser = await updateUser(user, { name, validate_account });
    message = "Mise à jour de l'utilisateur réussi.";
    res.json({
      message,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        validate_account: updatedUser.validate_account,
      },
    });
  } catch (error) {
    console.error("<userController: userUpdateName>", error);
    message = "Erreur lors de la modification du pseudo de l'utilisateur.";
    res.status(500).json({ message });
  }
};

/**
 * update user email.
 * Only own user can update his email.
 * When doing this action, create an activation token and repass user validate account to false.
 * User will receive a new email to validate his new email
 */
export const userUpdateEmail = async (req, res) => {
  let message;
  try {
    const user = await findUserById(req.user.id);
    const { email } = req.body;
    const updatedUser = await updateUser(user, { email });

    const token = createTokenFromSecret(process.env.CSRF_SECRET);
    emailFactory.sendEmailVerificationLink({
      to: email,
      url: `${req.protocol}://${req.get("host")}`,
      token: updatedUser.activation_token,
      serverToken: token,
    });

    message =
      "Mise à jour de l'utilisateur réussi. Merci de valider votre nouvelle adresse mail.";
    res.json({
      message,
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        validate_account: updatedUser.validate_account,
      },
    });
  } catch (error) {
    console.error("<userController: userUpdateEmail>", error);
    message = "Erreur lors de la modification de l'email de l'utilisateur.";
    res.status(500).json({ message });
  }
};

/**
 * get user corresponding to id sent in params.
 * Only own user can ack to delete his account.
 * User account will be mark as deleted for 30 days in db, time for user to changing mind
 * after this time, account will be deleted for true
 */
export const userDelete = async (req, res) => {
  let message;
  try {
    const user = await findUserById(req.user.id);
    user.deletedOn = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await user.save();
    message = `Votre compte à été suspendu. Sans aucune autre activité, il sera supprimé dans 30 jours. Si vous décidez de revenir sur votre choix, connecter vous simplement sur l'application.`;
    req.logout();
    res.json({ message });
  } catch (error) {
    console.error("<userController: userDelete>", error);
    message =
      "Erreur lors de la modification d'accéssibilité du compte de l'utilisateur.";
    res.status(500).json({ message });
  }
};

/**
 * get email send for action.
 * create a password token and a expiration time for the user.
 * Sent an email to modify his password
 */
export const userPasswordForgot = async (req, res) => {
  let message;
  try {
    const { email } = req.body;
    if (!email) {
      const message = "Aucun email transmis dans la requête";
      return res.status(404).json({ message });
    }
    const user = await findUserByEmail(email, ["id"]);
    if (!user) {
      return res.end();
    }
    user.password_token = uuidv4();
    user.password_token_expiration = Date.now() + 1000 * 60 * 30;
    await user.save();
    const token = createTokenFromSecret(process.env.CSRF_SECRET);

    emailFactory.sendResetPasswordLink({
      to: email,
      url: `${req.protocol}://${req.get("host")}`,
      userId: user.id,
      token: user.password_token,
      serverToken: token,
    });
    res.end();
  } catch (error) {
    console.error("<userController: userPasswordForgot>", error);
    message =
      "Erreur lors de l'envoi de mail de réinitialisation de mot de passe.";
    res.status(500).json({ message });
  }
};

/**
 * When an user click on the link sent in mail of the request before.
 * validate the token send by server, the password token of user and also it's not expired yet
 * hash the new password, remove token and expiration time
 */
export const userResetPassword = async (req, res) => {
  let message;
  try {
    const { id, passwordToken } = req.params;
    const { password } = req.body;

    const user = await findUserById(id);
    if (!user || !password) {
      message = "Impossible de modifier votre mot de passe";
    } else if (
      user.password_token !== passwordToken ||
      Date.now() > user.password_token_expiration
    ) {
      message =
        "le token fournit est invalide. Il est possible qu'il soit expiré.";
    }

    if (message) {
      return res.status(404).json({ message });
    }

    user.password = await hashPassword(password);
    user.password_token = null;
    user.password_token_expiration = null;
    await user.save();
    message =
      "Votre mot de passe à été modifié avec succès. Vous pouvez des à présent vous reconnecter avec votre nouveau mot de passe";
    return res.json({ message });
  } catch (error) {
    console.error("<userController: userResetPassword>", error);
    message = "Erreur lors de la réinitialisation du mot de passe.";
    res.status(500).json({ message });
  }
};

export const redirectToPasswordForm = (req, res) => {
  let message;
  try {
    if (
      !req.params.serverToken ||
      !validateTokenWithSecret(process.env.CSRF_SECRET, req.params.serverToken)
    ) {
      message = "Token invalide";
      return res.status(401).json({ message });
    }
    res.render("resetPasswordForm");
  } catch (error) {
    console.error("error");
    message = "erreur lors de la redirection utilisateur.";
    return res.status(500).json({ message });
  }
};
/**
 * update user avatar.
 * Only own user can update his avatar
 * first pass to multer middleware to register file (verify file size and mimetype)
 * update avatar with the new file and delete the previous one
 */
export const userUpdateAvatar = [
  async (req, res, next) => {
    let message;
    try {
      upload.single("avatar")(req, res, (err) => {
        if (err && err.code === "LIMIT_FILE_SIZE") {
          message =
            "Le fichier est trop volumineux. La taille maximate autorisée est de 1Mb.";
          res.status(400).json({ message });
          next(err);
        } else if (err && err.message === "type not allowed") {
          message = "Le type de fichier envoyé est invalide.";
          res.status(400).json({ message });
          next(err);
        } else if (err && err.message === "Unexpected field") {
          message = "Les données envoyées contiennent un champ incorrect.";
          res.status(400).json({ message });
          next(err);
        } else if (err) {
          res.status(400).json({ message: err.message });
          next(err);
        }
        next();
      });
    } catch (error) {
      console.error("<userController: userUpdateAvatar>", error);
      message = "Une erreur est survenue lors du traitement du fichier";
      res.status(500).json({ message });
      next(error);
    }
  },
  async (req, res) => {
    let message;
    try {
      const { id, avatar: previousAvatar } = req.user;
      const filename = req.file.filename;
      await updateAvatar(id, filename);
      if (previousAvatar) {
        deleteFile("users", previousAvatar);
      }
      message = "Avatar modifié avec succés.";
      res.json({ message, filename });
    } catch (error) {
      console.error("<userController: userUpdateAvatar>", error);
      message =
        "Une erreur est survenue lors de l'actualisation de l'avatar de l'utilisateur";
      return res.status(500).json({ message });
    }
  },
];

/**
 * Delete the current user avatar.
 * Action can be make by own user or Admin is avatar isn't appropriated.
 * delete the path registered in db and also the file from the backend
 */
export const userDeleteAvatar = async (req, res) => {
  let message;
  try {
    const user = await findUserById(req.params.id);
    if (!user || !user.avatar) {
      message = "Aucune donnée trouvée pour l'identifiant fourni.";
      return res.status(404).json({ message });
    }
    deleteFile("users", user.avatar);
    user.avatar = "";
    await user.save();
    message = "L'avatar de l'utilisateur à correctement été supprimé.";
    res.json({
      message,
      user: { id: user.id, name: user.name, avatar: user.avatar },
    });
  } catch (error) {
    console.error("<userController: userDeleteAvatar>", error);
    message =
      "Une erreur est survenue lors de la suppression de l'avatar de l'utilisateur";
    return res.status(500).json({ message });
  }
};

// export const userValidAccount = async (req, res) => {
//   let message;
//   try {
//     if (!req.user.role.includes("ADMIN")) {
//       message = "Vous n'avez pas les droits.";
//       return res.status(403).json({ message });
//     }
//     const user = await findUserById(req.params.id);
//     if (!user) {
//       message = "Aucune donnée trouvée pour l'identifiant fourni.";
//       return res.status(404).json({ message });
//     }
//     await validUser(user);
//     message = "Compte utilisateur actualisé.";
//     return res.json({ message, validate_account: user.validate_account });
//   } catch (error) {
//     console.error("<userController: userValidAccount>", error);
//     message =
//       "Une erreur est survenue lors de l'actualisation du statut du compte utilisateur";
//     return res.status(500).json({ message });
//   }
// };
