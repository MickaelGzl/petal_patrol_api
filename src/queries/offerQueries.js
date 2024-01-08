import { Op } from "sequelize";
import { Offer } from "../db/server.js";

/**
 * find all offer corresponding to a plant
 */
export const findOfferByPlantId = (plantId) => {
  return Offer.findAll({ where: { plantId: { [Op.eq]: plantId } } });
};

export const createOffer = async (offer, userId) => {
  const newOffer = await Plant.create({
    ...offer,
  });
  newOffer.setUser(userId);
  return newOffer.save();
};
