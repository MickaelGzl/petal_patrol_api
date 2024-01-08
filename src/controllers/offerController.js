import { verifyUserCanMakeAction } from "../config/authConfig.js";
import {
  createOffer,
  deleteOffer,
  findAllOffer,
  findOfferById,
  findOfferByUserId,
  updateOffer,
} from "../queries/offerQueries.js";
import { findPlantById } from "../queries/plantQueries.js";

/**
 * create an offer with params send in req.body
 */
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

/**
 * get all offers with queries
 * all registered in app if Admin, all that is not guard yet if user
 */
export const offerGetAll = async (req, res) => {
  let message;
  try {
    const offers = await findAllOffer(req.query, req.path === "/");
    message = `La liste des offres ${
      req.path === "/" && "en cours"
    } à bien été récupérée.`;
    res.json({ message, offers });
  } catch (error) {
    console.error("<offerController: offerGetAll>", error);
    message = "Erreur lors de la récupération de la liste des offres.";
    res.status(500).json({ message });
  }
};

export const offerGetMy = async (req, res) => {
  let message;
  try {
    const offers = await findOfferByUserId(
      { active: req.query.active },
      req.user.id
    );
    message = `La liste de vos offres ${
      req.query.active && "en cours"
    } à bien été récupérée.`;
    res.json({ message, offers });
  } catch (error) {
    console.error("<offerController: offerGetMy>", error);
    message = "Erreur lors de la récupération de votre liste d'offres.";
    res.status(500).json({ message });
  }
};

export const offerGetOne = async (req, res) => {
  let message;
  try {
    const offer = await findOfferById(req.params.id);
    if (!offer) {
      message = "Aucune offre trouvé pour l'identifiant fournis.";
      return res.status(404).json({ message });
    }
    message = "Offre récupérée avec succès.";
    return res.json({ message, offer });
  } catch (error) {
    console.error("<offerController: offerGetOne>", error);
    message = "Erreur lors de la récupération l'offre concernée.";
    res.status(500).json({ message });
  }
};

export const offerUpdate = async (req, res) => {
  let message;
  try {
    const offer = await findOfferById(req.params.id);
    const cancel = verifyUserCanMakeAction(offer, req.user, true, "ownerId");
    if (cancel) {
      message = cancel.message;
      return res.status(cancel.status).json({ message });
    }

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

    if (plantId) {
      const cancel = verifyUserCanMakeAction(
        await findPlantById(plantId),
        req.user
      );
      if (cancel) {
        message = cancel.message;
        return res.status(cancel.status).json({ message });
      }
    }

    if (address || city || zip) {
      offer.coordinates = null;
    }

    const updatedOffer = await updateOffer(offer, {
      description,
      address,
      city,
      zip,
      coordinates,
      allow_advices,
      date_from,
      date_to,
      plantId,
    });

    message = " L'offre à été actualisée avec succès.";
    return res.json({ message, offer: updatedOffer });
  } catch (error) {
    console.error("<offerController: offerUpdate>", error);
    message = "Erreur lors de l'actualisation de l'offre.";
    res.status(500).json({ message });
  }
};

export const offerUpdateAdvice = async (req, res) => {
  let message;
  try {
    if (!req.user.role.includes("BOTANIST")) {
      message = "Vous ne pouvez pas écrire de conseils sur cette offre.";
      return res.status(403).json({ message });
    }
    const offer = await findOfferById(req.params.id);
    if (!offer) {
      message = "Aucune offre correspondant à l'identifiant fournis.";
      return res.status(404).json({ message });
    }

    await updateOffer(offer, {
      advice: req.body.advice,
    });

    message = "Votre avis à été ajouté à l'offre avec succès.";
    return res.json({ message });
  } catch (error) {
    console.error("<offerController: offerUpdateAdvice>", error);
    message =
      "Erreur lors de l'actualisation des conseils sur l'offre sélectionnée.";
    res.status(500).json({ message });
  }
};

export const offerDelete = async (req, res) => {
  let message;
  try {
    const offer = await findOfferById(req.params.id);
    const cancel = verifyUserCanMakeAction(offer, req.user, true, "ownerId");
    if (cancel) {
      message = cancel.message;
      return res.status(cancel.status).json({ message });
    }
    if (offer.date_to > new Date().getTime() && offer.guardianId !== null) {
      message =
        "Vous ne pouvez pas supprimer cette offre, car elle est toujours en cours.";
      return res.status(400).json({ message });
    }
    await deleteOffer(offer.id);
    message = "L'offre à été supprimé avec succès.";
    res.json({ message });
  } catch (error) {
    console.error("<offerController: offerDelete>", error);
    message = "Erreur lors de la suppression de l'offre.";
    res.status(500).json({ message });
  }
};

export const updateOfferGuardian = (offer, guardianId) => {
  return offer.update({ guardianId });
};
