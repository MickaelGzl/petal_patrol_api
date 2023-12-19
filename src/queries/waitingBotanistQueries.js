import { User, waitingBotanist } from "../db/server.js";

export const findAllWaitingBotanist = () => {
  return waitingBotanist.findAll({
    include: [
      {
        model: User,
        through: { attributes: [] },
        attributes: ["id", "name", "email"],
      },
    ],
  });
};

export const createWaitingBotanist = async (userId, message) => {
  const newBotanist = await waitingBotanist.create({ message });
  newBotanist.addUser(userId);
  return newBotanist.save();
};

export const findWaitingBotanistById = (id) => {
  return waitingBotanist.findByPk(id);
};

export const deleteWaitingBotanist = (id) => {
  return waitingBotanist.destroy({ where: { id } });
};
