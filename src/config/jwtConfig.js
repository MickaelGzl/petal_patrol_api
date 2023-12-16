import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { findUserById } from "../queries/userQueries.js";
import { findRoleByUserId } from "../queries/roleQueries.js";

dotenv.config();

const secret = process.env.JWT_SECRET_KEY;

const createToken = (user) => {
  const token = jwt.sign(
    {
      sub: user.id,
      exp: Math.floor(Date.now() / 100) + 60 * 60 * 24 * 2,
    },
    secret
  );
  return token;
};

export const extractUserFromToken = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      let decodedToken = jwt.verify(token, secret);
      const user = await findUserById(decodedToken.sub);

      if (!user) {
        res.clearCookie("jwt");
      } else {
        const userRoles = await findRoleByUserId(user.id);
        const role = userRoles.map((role) => role.dataValues.role);

        req.user = { ...user.dataValues, role };
      }
    } catch (error) {
      console.error(error);
      res.clearCookie("jwt");
    }
  }
  next();
};

export const addJwtFeatures = (req, res, next) => {
  req.isAuthenticated = () => !!req.user;
  req.logout = () => res.clearCookie("jwt");

  req.login = (user) => {
    const token = createToken(user);
    res.cookie("jwt", token, { httpOnly: true });
  };
  next();
};
