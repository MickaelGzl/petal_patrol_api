import { User } from "../db/server.js";

export const findUserById = (id) => {
  return User.findByPk(id);
};
