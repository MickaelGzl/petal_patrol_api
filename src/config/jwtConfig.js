import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { findUserById } from "../queries/userQueries";

dotenv.config();

const createToken = (user) => {
  const token = jwt.sign(
    {
      sub: user._id.toString(),
      exp: Math.floor(Date.now() / 100) + 60 * 60 * 24 * 2,
    },
    secret
  );
  return token;
};

export const extractUserFromToken = async (req, res, next) => {
  const token = req.cookies.jwt;
  console.log("token:", token);
  if (token) {
    try {
      let decodedToken = jwt.verify(token, secret);
      const user = await findUserById(decodedToken.sub);
      if (!user) {
        res.clearCookie("jwt");
      } else {
        req.user = user;
      }
    } catch (error) {
      res.clearCookie("jwt");
      //   next();
    }
  } else {
    console.log("no token, next");
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
