import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { findRoleByName } from "../queries/roleQueries.js";
import {
  createUser,
  findUserByEmail,
  comparePasswords,
  findAllUser,
  findUserById,
  updateUser,
  deleteUser,
  hashPassword,
  findUserByToken,
} from "../queries/userQueries.js";
import { createTokenFromSecret } from "../config/csrfConfig.js";
import { emailFactory } from "../mailer/index.js";

dotenv.config();
/**
 * create an user when signup in application
 * verify email is not already in use
 * give to user USER role
 */
export const userCreate = async (req, res) => {
  let message;
  try {
    const emailAlreadyInUse = await findUserByEmail(req.body.email, ["email"]);
    if (emailAlreadyInUse) {
      message = "Cet email est déjà utilisé.";
      return res.status(409).json({ message });
    }
    const userRole = await findRoleByName("USER");
    const user = await createUser(req.body, userRole);

    emailFactory.sendEmailVerificationLink({
      to: email,
      url: req.headers.origin,
      token: user.activation_token,
    });

    message = "L'utilisateur à bien été crée";
    res.json({ message, user });
  } catch (error) {
    console.error("<userController: userCreate>", error);
    message = "Erreur lors de la création de l'utilisateur.";
    res.status(500).json({ message });
  }
};

/**
 * log user
 * find user corresponding to email and compare the passwords in body and db
 * user need to validate is email
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

    if (!user.validate_account) {
      message =
        "Vous devez confirmer votre email pour continuer sur l'application.";
      return res.status(403).json({ message });
    }

    req.login(user);
    message = "Connexion réussi.";
    return res.json({ message, user: { ...user.dataValues, password: "" } });
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

export const userValidateEmail = async (req, res) => {
  let message;
  try {
    const user = await findUserByToken(req.params.token);
    if (!user) {
      message = "Aucun utilisateur pour l'identifiant fournis.";
      return res.status(404).json({ message });
    }
    user.validate_account = true;
    user.activation_token = "";
    await user.save();
    message = "Le compte est désormais valide.";
    return res.json({ message });
  } catch (error) {
    console.error("<userController: userValidateEmail>", error);
    message = "Erreur lors de la validation de l'email de l'utilisateurs.";
    res.status(500).json({ message });
  }
};

/**
 * find all users, can search by name ( + role if user is admin)
 * if receive role.query and user isn't admin, block request
 * if user isn't admin, do not send role and validate_account
 */
export const userFindAll = async (req, res) => {
  let message;
  const isAdmin = req.user.role.includes("ADMIN");
  try {
    if (req.query.role && !isAdmin) {
      message = "Vous n'avez pas les droits d'accès à cette ressource";
      return res.status(403).json({ message });
    }
    const allUsers = await findAllUser(req.query, req.user);
    message = "La liste des utilisateurs à bien été récupérée.";

    res.json({
      message,
      allUsers: isAdmin
        ? allUsers
        : allUsers.map(({ dataValues }) => {
            delete dataValues.roles;
            delete dataValues.validate_account;
            return dataValues;
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
 */
export const userFindOne = async (req, res) => {
  let message;
  try {
    const user = await findUserById(req.params.id);
    if (!user) {
      message = "Aucun utilisateur correspondant à l'identifiant fourni.";
      return res.status(404).json({ message, id: req.params.id });
    }
    message = `L'utilisateur ${id} à bien été récupéré.`;
    res.json({ message, user });
  } catch (error) {
    console.error("<userController: userFindOne>", error);
    message = "Erreur lors de la récupération de l'utilisateur.";
    res.status(500).json({ message });
  }
};

/**
 * find user by id and update him with new values send in request
 */
export const userUpdate = async (req, res) => {
  let message;
  try {
    const user = await findUserById(req.params.id);
    if (!user) {
      message = "Aucun utilisateur correspondant à l'identifiant fourni.";
      return res.status(404).json({ message, id: req.params.id });
    }
    const updatedUser = await updateUser(user, req.body);
    message = "Mise à jour de l'utilisateur réussi.";
    res.json({
      message,
      user: { name: updatedUser.name, email: updatedUser.email },
    });
  } catch (error) {
    console.error("<userController: userUpdate>", error);
    message = "Erreur lors de la modification de l'utilisateur.";
    res.status(500).json({ message });
  }
};

/**
 * delete user corresponding to id sent in params
 */
export const userDelete = async (req, res) => {
  let message;
  try {
    await deleteUser(req.params.id);
    message = `L'utilisateur ${req.params.id} à bien été supprimé.`;
    res.json({ message });
  } catch (error) {
    console.error("<userController: userDelete>", error);
    message = "Erreur lors de la suppression de l'utilisateur.";
    res.status(500).json({ message });
  }
};

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
      url: req.headers.origin,
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

export const userResetPassword = async (req, res) => {
  let message;
  try {
    const { id, passwordToken } = req.params;
    const { password } = req.body;
    const user = await findUserById(id);
    if (!user) {
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

    user.password_token = null;
    user.password_token_expiration = null;
    user.password = await hashPassword(password);
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
