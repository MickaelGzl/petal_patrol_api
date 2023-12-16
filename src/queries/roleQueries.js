import { Role } from "../db/server.js";
import { Op } from "sequelize";

export const findRoleByName = (role) => {
  return Role.findOne({
    where: { role: { [Op.eq]: role } },
    attributes: ["id", "role"],
  });
};
