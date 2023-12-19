import { Op } from "sequelize";
import { Offer } from "../db/server.js";

export const findOfferByPlantId = (plantId) => {
  return Offer.findAll({ where: { plantId: { [Op.eq]: plantId } } });
};
