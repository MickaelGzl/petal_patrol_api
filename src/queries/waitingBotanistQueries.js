import { User, waitingBotanist } from "../db/server.js";

export const findAllWaitingBotanist = () => {
  return waitingBotanist.findAll({
    include: [
      {
        model: User,
        attributes: ["id", "name", "siret"],
      },
    ],
  });
};

export const createWaitingBotanist = async (userId, message) => {
  const newBotanist = await waitingBotanist.create({ message });
  newBotanist.setUser(userId);
  return newBotanist.save();
};

export const findWaitingBotanistById = (id) => {
  return waitingBotanist.findByPk(id);
};

export const deleteWaitingBotanist = (id) => {
  return waitingBotanist.destroy({ where: { id } });
};
