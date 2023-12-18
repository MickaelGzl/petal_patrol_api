import { Role, User } from "../db/server.js";
import { Op } from "sequelize";

/**
 *
 * @param {string} role
 * @returns same role registered in db
 */
export const findRoleByName = (role) => {
  return Role.findOne({
    where: { role: { [Op.eq]: role } },
    attributes: ["id", "role"],
  });
};

/**
 * find all role an user have
 * @param {number} userId
 * @returns the roles associated with the user corresponding to id
 */
export const findRoleByUserId = async (userId) => {
  return Role.findAll({
    include: [
      {
        model: User,
        through: { attributes: [] },
        attributes: [],
        where: { id: userId },
      },
    ],
    attributes: ["role"],
  });
};
