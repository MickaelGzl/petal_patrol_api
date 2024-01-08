import { Op } from "sequelize";
import { Offer, Plant, User } from "../db/server.js";

const DEFAULT_OPTIONS = {
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

/**
 * return a list of offers registered in app
 * @param {Object} query queryParams send in url
 * @param {boolean} forUser request made by user (only send active offers)
 * @returns all offers corresponding to queries
 */
export const findAllOffer = (query, forUser) => {
  let options = { ...DEFAULT_OPTIONS };

  if (forUser || query.active) {
    options = {
      ...options,
      where: {
        [Op.and]: [
          { guardianId: { [Op.is]: null } },
          { complete: false },
          { date_to: { [Op.gt]: Date.now() } },
        ],
      },
    };
  }

  if (query && query.city) {
    options = {
      ...options,
      where: { ...options.where, city: { [Op.like]: `%${query.city}%` } },
    };
  }

  if (query && query.plant) {
    options.include[2] = {
      ...options.include[2],
      where: { type: { [Op.like]: `%${query.plant}%` } },
    };
  }

  return Offer.findAll(options);
};

export const findOfferByUserId = (query, userId) => {
  let options = {
    ...DEFAULT_OPTIONS,
    where: { ownerId: { [Op.eq]: userId } },
  };

  if (query && query.active) {
    options = {
      ...options,
      where: {
        ...options.where,
        complete: false,
        date_to: { [Op.gt]: Date.now() },
      },
    };
  }

  return Offer.findAll(options);
};

/**
 * find all offer corresponding to a plant
 */
export const findOfferByPlantId = (plantId) => {
  return Offer.findAll({ where: { plantId: { [Op.eq]: plantId } } });
};

export const findOfferById = (id) => {
  return Offer.findOne({ ...DEFAULT_OPTIONS, where: { id } });
};

export const createOffer = async (offer, userId) => {
  const newOffer = await Offer.create({
    ...offer,
  });
  newOffer.setOwner(userId);
  return newOffer.save();
};

export const updateOffer = async (offer, newValues) => {
  return offer.update(newValues);
};

export const deleteOffer = (id) => {
  return Offer.destroy({ where: { id } });
};
