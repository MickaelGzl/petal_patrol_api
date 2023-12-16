import { findRoleByName } from "../queries/roleQueries.js";
import {
  createUser,
  findUserByEmail,
  comparePasswords,
} from "../queries/userQueries.js";

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
    message = "L'utilisateur à bien été crée";
    res.json({ message, user });
  } catch (error) {
    console.error(error);
    message = "Erreur lors de la création de l'utilisateur.";
    res.status(500).json({ message });
  }
};

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

    req.login(user);
    message = "Connexion réussi.";
    return res.json({ message, user: { ...user.dataValues, password: "" } });
  } catch (error) {
    console.error(error);
    message = "Erreur lors de la connexion de l'utilisateur.";
    return res.status(500).json({ message });
  }
};

export const userSignOut = (req, res) => {
  let message;
  try {
    req.logout();
    message = "Déconnexion réussi.";
    res.json({ message });
  } catch (error) {
    console.error(error);
    message = "Erreur lors de la déconnexion de l'utilisateur.";
    res.status(500).json({ message });
  }
};
