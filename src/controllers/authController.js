import dotenv from "dotenv";
import {
  createTokenFromSecret,
  validateTokenWithSecret,
} from "../config/csrfConfig.js";

dotenv.config();

/**
 * create a csrf token with secret
 */
export const createFormToken = async (req, res) => {
  try {
    const token = createTokenFromSecret(process.env.CSRF_SECRET);
    return res.json({ token });
  } catch (error) {
    console.error("<authController: createFormToken>", error);
    res.status(500).json({ message: "Erreur lors de la création d'un token" });
  }
};

/**
 * compare received token with secret
 * block the request if token is empty or invalid
 */
export const verifyToken = async (req, res) => {
  let message;
  try {
    const token = req.body.csrfToken;
    if (!token || !validateTokenWithSecret(process.env.CSRF_SECRET)) {
      message = "Token invalide.";
      return res.status(401).json({ message });
    }
    next();
  } catch (error) {
    console.error("<authController: verifyToken>", error);
    message = "Erreur lors de la vérification du token.";
    res.status(500).json({ message });
  }
};
