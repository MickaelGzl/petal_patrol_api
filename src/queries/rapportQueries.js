import { Op } from "sequelize";
import { Rapport } from "../db/server";

export const findAllRapport = (page) => {
  if (!page) {
    page = 0;
  }
  return Rapport.findAll({ offset: page * 20, limit: (page + 1) * 20 });
};

export const findRapportByUserId = (userId) => {
  return Rapport.findAll({ where: { userId: { [Op.eq]: userId } } });
};
