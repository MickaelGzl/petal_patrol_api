import { Role, User } from "../db/server.js";
import { Op } from "sequelize";

export const findRoleByName = (role) => {
  return Role.findOne({
    where: { role: { [Op.eq]: role } },
    attributes: ["id", "role"],
  });
};

export const findRoleByUserId = async (userId) => {
  return Role.findAll({
    include: [
      { model: User, through: { attributes: [] }, where: { id: userId } },
    ],
    attributes: ["role"],
  });
};
