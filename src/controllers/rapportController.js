import { findOfferById } from "../queries/offerQueries.js";
import {
  findAllRapport,
  findRapportByUserId,
} from "../queries/rapportQueries.js";

export const rapportGetAll = async (req, res) => {
  let message;
  try {
    const { page } = req.query;
    const fetchedRapport = await findAllRapport(page);
    const rapports = fetchedRapport.map((rapport) => {
      return { ...rapport.dataValues, offerUrl: `/offer/${rapport.offerId}` };
    });
    message =
      "La liste des rapports enregistrés sur l'application à bien été récupérée.";
    res.json({ message, rapports });
  } catch (error) {
    console.error("<rapportController: rapportGetAll>", error);
    message = "Une erreur est survenue lors de la récupération des rapports.";
    return res.status(500).json({ message });
  }
};

export const rapportGetMy = async (req, res) => {
  let message;
  try {
    const fetchedRapport = await findRapportByUserId(req.user.id);
    if (fetchedRapport.length === 0) {
      message = "Vous n'avez encore aucun rapport écris.";
      return res.json({ message });
    }
    const offerIdsSet = new Set();
    fetchedRapport.forEach((rapport) => offerIdsSet.add(rapport.offerId));
    console.log(offerIdsSet);
    const offers = await Promise.all(
      Array.from(offerIdsSet).map(
        async (offerId) => await findOfferById(offerId)
      )
    );
    const rapports = fetchedRapport.map((rapport) => {
      return {
        ...rapport.dataValues,
        offer: offers.find((offer) => offer.id === rapport.offerId),
      };
    });
    message = "La liste de vos rapport à bien été récupérée";
    return res.json({ message, rapports });
  } catch (error) {
    console.error("<rapportController: rapportGetMy>", error);
    message =
      "Une erreur est survenue lors de la récupération de vos rapports.";
    return res.status(500).json({ message });
  }
};
