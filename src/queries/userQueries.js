import bcrypt from "bcrypt";
import { User, Role } from "../db/server.js";
import { Op } from "sequelize";

export const findAllUser = (query) => {
  let options = {
    order: [["id", "DESC"]],
    attributes: {
      exclude: ["googleId", "password_token", "activation_token", "password"],
    },
    include: [
      {
        model: Role,
        through: { attributes: [] },
        attributes: ["role"],
      },
    ],
  };

  if (query && query.role) {
    options.include[0].where = { role: { [Op.eq]: query.role.toUppercase() } };
  }

  if (query && query.search) {
    options = {
      ...options,
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query.search}%` } },
          { email: { [Op.like]: `%${query.search}%` } },
        ],
      },
    };
  }

  return User.findAll(options);
};

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

export const updateUser = (user, newData) => {
  return user.update(newData);
};

export const deleteUser = (id) => {
  return User.destroy({ where: { id } });
};
