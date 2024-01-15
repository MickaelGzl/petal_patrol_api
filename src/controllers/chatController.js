import { findCurrentOfferWithUser } from "../queries/offerQueries.js";

export const chatOfUser = async (req, res) => {
  let message;
  try {
    const rooms = await findCurrentOfferWithUser(req.user.id);
    if (rooms.length === 0) {
      message = "Aucune room utilisateur.";
      return res.status(404).json({ message });
    }
    message = "Une liste de room à été trouvée.";
    return res.json({ message, rooms });
  } catch (error) {
    console.error("<chatController: chatOfUser>", error);
    message = "Erreur lors de la récupération des rooms de l'utilisateurs.";
    res.status(500).json({ message });
  }
};
