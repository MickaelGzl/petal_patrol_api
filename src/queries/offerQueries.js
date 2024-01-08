import { Op } from "sequelize";
import { Offer, Plant, User } from "../db/server.js";

/**
 * find all offer corresponding to a plant
 */
export const findOfferByPlantId = (plantId) => {
  return Offer.findAll({ where: { plantId: { [Op.eq]: plantId } } });
};

export const findAllOffer = (query) => {
  let options = {
    order: [["id", "DESC"]],
    include: [
      {
        model: User,
        as: "owner",
        attributes: ["name", "email", "id"],
      },
      {
        model: User,
        as: "guardian",
        attributes: ["name", "email", "id"],
      },
      {
        model: Plant,
        attributes: ["name", "type", "id"],
      },
    ],
  };

  if (query && query.city) {
    options = { ...options, where: { city: { [Op.like]: `%${query.city}%` } } };
  }

  if (query && query.plant) {
    options.include[2] = {
      ...options.include[2],
      where: { type: { [Op.like]: `%${query.plant}%` } },
    };
  }

  return Offer.findAll(options);
};

export const createOffer = async (offer, userId) => {
  const newOffer = await Offer.create({
    ...offer,
  });
  newOffer.setOwner(userId);
  return newOffer.save();
};
