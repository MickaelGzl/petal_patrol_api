import { Op } from "sequelize";
import { Offer, Rapport } from "../db/server.js";

export const findAllRapport = (page) => {
  if (!page) {
    page = 0;
  }
  return Rapport.findAll({ offset: page * 20, limit: (page + 1) * 20 });
};

export const findRapportByOfferId = (offerId) => {
  return Rapport.findAll({ where: { offerId } });
};

export const findRapportById = (id) => {
  const options = {
    where: { id: { [Op.eq]: id } },
    include: [
      {
        model: Offer,
        attributes: ["guardianId", "ownerId"],
      },
    ],
  };
  return Rapport.findOne(options);
};

export const createRapport = async (rapport, offerId) => {
  const newRapport = await Rapport.create({ ...rapport });
  newRapport.setOffer(offerId);
  return newRapport.save();
};

export const updateRapport = (rapport, newValues) => {
  return Rapport.update(newValues);
};
