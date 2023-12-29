import { Op } from "sequelize";
import { Plant } from "../db/server.js";

/**
 * search all plants in db, can include filters
 * @param {string} list define if the query if made by admin or by user to see his own plants
 * @param {{search: string, user: string, username: string} | number} query
 * @returns array of Plants corresponding to research
 */
export const findAllPlants = (list, query) => {
  let options = {
    order: [["id", "DESC"]],
  };

  if (list === "all") {
    if (query && query.search) {
      options = {
        ...options,
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${query.search}%` } },
            { type: { [Op.like]: `%${query.search}%` } },
          ],
        },
      };
    }

    if (query && query.user) {
      options = {
        ...options,
        include: [
          {
            model: User,
            through: { attributes: [] },
            attributes: ["id", "name"],
          },
        ],
      };
    }

    if (query && query.user && query.username) {
      options.include[0].where = { name: { [Op.like]: `%${query.user}%` } };
    }
  } else if (list === "user") {
    options = { ...options, where: { userId: query } };
  }

  return Plant.findAll(options);
};

/**
 * return the specific plant corresponding to id
 * @param {number} id
 * @returns plant corresponding to id in params
 */
export const findPlantById = (id) => {
  return Plant.findByPk(id);
};

export const createPlant = async ({ name, type, images }, userId) => {
  const newPlant = await Plant.create({
    name,
    type,
    images,
  });
  newPlant.setUser(userId);
  return newPlant.save();
};

export const updatePlant = (plant, newValues) => {
  return plant.update(newValues);
};

export const deletePlant = (id) => {
  return Plant.destroy({ where: { id } });
};
