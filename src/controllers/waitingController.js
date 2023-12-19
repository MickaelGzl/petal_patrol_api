import { deleteUser, updateBotanistUser } from "../queries/userQueries.js";
import {
  deleteWaitingBotanist,
  findAllWaitingBotanist,
  findWaitingBotanistById,
} from "../queries/waitingBotanistQueries.js";

export const waitingBotanistFindAll = async (req, res) => {
  let message;
  try {
    const allBotanistWaiting = await findAllWaitingBotanist();
    message = "La liste des botanistes en attente à bien été récupérée.";
    res.json({ message, botanist: allBotanistWaiting });
  } catch (error) {
    console.error("<waitingController: waitingBotanistFindAll>", error);
    message =
      "Erreur lors de la récupération de la liste d'attente des botanistes.";
    res.status(500).json({ message });
  }
};

export const waitingBotanistUpdate = async (req, res) => {
  let message;
  try {
    const { acceptance } = req.body;
    if (acceptance === undefined) {
      message = "Aucune réponse fourni dans la requête.";
      return res.status(404).json({ message });
    }
    const waitingBotanist = await findWaitingBotanistById(req.params.id);
    if (!waitingBotanist) {
      message = "Aucune donnée trouvé pour l'identifiant fournis.";
      return res.status(404).json({ message });
    }

    if (acceptance) {
      await updateBotanistUser(waitingBotanist.userId);
    } else {
      await deleteUser(waitingBotanist.userId);
    }
    await deleteWaitingBotanist(waitingBotanist.id);
    message = `La demande du botaniste à été ${
      acceptance ? "acceptée" : "refusée"
    } avec succès.`;
    res.json({ message });
  } catch (error) {
    console.error("<waitingController: waitingBotanistUpdate>", error);
    message = "Erreur lors de l'actualisation de la demande du botaniste.";
    res.status(500).json({ message });
  }
};
