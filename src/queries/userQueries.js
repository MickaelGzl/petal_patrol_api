import bcrypt from "bcrypt";
import { User, Role } from "../db/server.js";
import { Op } from "sequelize";

/**
 * get all user registered in app, can take a query object to affine research
 * @param {{role: string, search: string} | undefined} query
 * @returns all user registered in app corresponding to the query
 */
export const findAllUser = (query) => {
  let options = {
    order: [["id", "DESC"]],
    attributes: {
      exclude: [
        "googleId",
        "password_token",
        "activation_token",
        "password",
        "password_token_expiration",
      ],
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

/**
 * find user by specific id
 * @param {number} id
 * @returns user corresponding to param id
 */
export const findUserById = (id) => {
  return User.findByPk(id);
};

/**
 * find user by specific email
 * @param {string} email
 * @param {string[]} attributes an array of column to select, create by server depending of the interest of the request
 * @returns all attributes selected of the user corresponding to email
 */
export const findUserByEmail = (email, attributes) => {
  return User.findOne({
    where: { email: { [Op.eq]: email } },
    attributes: attributes,
  });
};

/**
 * create an user, and give him USER role
 * @param {User} user
 * @param {Role} role
 * @returns new user created with attribued role
 */
export const createUser = async (user, role) => {
  const hashedPassword = await hashPassword(user.password);
  const newUser = await User.create({
    ...user,
    password: hashedPassword,
  });
  newUser.addRole(role);
  return newUser.save();
};

/**
 * compare password user enter for login, and password registered in db
 * @param {string} password
 * @param {string} hashedPassword
 * @returns a boolean value, true if password are the same
 */
export const comparePasswords = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * take request and update the user
 * @param {User} user
 * @param {Partial<User>} newData
 * @returns the updated user with new values
 */
export const updateUser = (user, newData) => {
  return user.update(newData);
};

/**
 * delete the user corresponding to id
 * @param {number} id
 * @returns
 */
export const deleteUser = (id) => {
  return User.destroy({ where: { id } });
};

export const hashPassword = (pass) => {
  return bcrypt.hash(pass, 12);
};
