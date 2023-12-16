import bcrypt from "bcrypt";
import { User } from "../db/server.js";
import { Op } from "sequelize";

export const findUserById = (id) => {
  return User.findByPk(id);
};

export const findUserByEmail = (email, attributes) => {
  return User.findOne({
    where: { email: { [Op.eq]: email } },
    attributes: attributes,
  });
};

export const createUser = async (user, role) => {
  const hashPassword = await bcrypt.hash(user.password, 12);
  const newUser = await User.create({
    ...user,
    password: hashPassword,
  });
  newUser.addRole(role);
  return newUser.save();
};

export const comparePasswords = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
