import { verifyUserCanMakeAction } from "../config/authConfig.js";
import { createOffer, findAllOffer } from "../queries/offerQueries.js";
import { findPlantById } from "../queries/plantQueries.js";

export const offerCreate = async (req, res) => {
  let message;
  try {
    const {
      description,
      address,
      city,
      zip,
      coordinates,
      allow_advices,
      date_from,
      date_to,
      plantId,
    } = req.body;
    if (!address || !city || !zip || !coordinates) {
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
        city,
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

export const offerGetAll = async (req, res) => {
  let message;
  try {
    const offers = await findAllOffer(req.query);
    message = "La liste des offres à bien été récupérée.";
    res.json({ message, offers });
  } catch (error) {
    console.error("<offerController: offerGetAll>", error);
    message = "Erreur lors de la récupération de la liste des offres.";
    res.status(500).json({ message });
  }
};
