import { User } from "../db/server";

export const findUserById = (id) => {
  return User.findByPk(id);
};
