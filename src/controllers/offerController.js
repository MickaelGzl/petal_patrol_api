import { verifyUserCanMakeAction } from "../config/authConfig";
import { createOffer } from "../queries/offerQueries";
import { findPlantById } from "../queries/plantQueries";

export const offerCreate = async (req, res) => {
  let message;
  try {
    const {
      description,
      address,
      zip,
      coordinates,
      allow_advices,
      date_from,
      date_to,
      plantId,
    } = req.body;
    if ((!address && !zip) || !coordinates) {
      message = "Aucune adresse renseignée.";
      return res.status(400).json({ message });
    }
    const relatedPlant = await findPlantById(plantId);
    const cancel = verifyUserCanMakeAction(relatedPlant, req.user);
    if (cancel) {
      message = cancel.message;
      return res.status(cancel.status).json({ message });
    }

    const offer = await createOffer(
      {
        description,
        address,
        zip,
        coordinates,
        allow_advices,
        date_from,
        date_to,
        plantId,
      },
      req.user.id
    );
    message = "Votre offre à bien été enregistrée.";
    return res.json({ message, offer });
  } catch (error) {
    console.error("<offerController: offerCreate>", error);
    message = "Erreur lors de la création de l'offre";
    res.status(500).json({ message });
  }
};
