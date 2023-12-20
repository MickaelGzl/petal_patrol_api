import { verifyUserCanMakeAction } from "../config/authConfig.js";
import {
  createPlant,
  deletePlant,
  findAllPlants,
  findPlantById,
  updatePlant,
} from "../queries/plantQueries.js";
import { findOfferByPlantId } from "./offerController.js";

/**
 * return all plants registered in app
 * corresponding to filters (plant name, include user, and username)
 * cannot access if user isn't admin
 */
export const plantFindAll = async (req, res) => {
  let message;
  try {
    const allPlants = await findAllPlants("all", req.query);
    message = "La liste des plantes à bien été récupérée.";
    res.json({ message, allPlants });
  } catch (error) {
    console.error("<plantController: plantFindAll>", error);
    message = "Erreur lors de la récupération de la liste des plantes";
    res.status(500).json({ message });
  }
};

/**
 * return all the plants registered by user
 */
export const plantByUser = async (req, res) => {
  let message;
  try {
    const allPlants = await findAllPlants("user", req.user.id);
    message = "La liste des plantes de l'utilisateur à bien été récupérée.";
    res.json({ message, allPlants });
  } catch (error) {
    console.error("<plantController: plantByUser>", error);
    message =
      "Erreur lors de la récupération de la liste des plantes de l'utilisateur";
    res.status(500).json({ message });
  }
};

/**
 * find plant by id passed in req.params
 * block process if plant if not of the user, or if user isn't admin
 */
export const plantById = async (req, res) => {
  let message;
  try {
    const plant = await findPlantById(req.params.id);
    if (!plant) {
      message = "Aucune plante trouvée pour l'identifiant fourni.";
      return res.status(404).json({ message });
    } else if (
      plant.userId !== req.user.id ||
      !req.user.role.includes("ADMIN")
    ) {
      message = "Vous n'avez pas les droits d'accès à cette ressource.";
      return res.status(403).json({ message });
    }
    message = "La plante correspondante à bien été récupérée.";
    res.json({ message, plant });
  } catch (error) {
    console.error("<plantController: plantById>", error);
    message = "Erreur lors de la récupération de la plante";
    res.status(500).json({ message });
  }
};

export const plantCreate = async (req, res) => {
  let message;
  try {
    const plant = await createPlant(req.body, req.user.id);
    message = "Une nouvelle plante à bien été crée.";
    return res.json({ plant });
  } catch (error) {
    console.error("<plantController: plantCreate>", error);
    message = "Erreur lors de la création de la plante";
    res.status(500).json({ message });
  }
};

export const plantUpdate = async (req, res) => {
  let message;
  try {
    const plantToUpdate = await findPlantById(req.params.id);
    const cancel = verifyUserCanMakeAction(plantToUpdate, req.user);
    if (cancel) {
      message = cancel.message;
      return res.status(cancel.status).json({ message });
    }
    const updatedPlant = await updatePlant(plantToUpdate, req.body);
    message = "La plante à correctement été msie à jour.";
    res.json({ message, plant: updatedPlant });
  } catch (error) {
    console.error("<plantController: plantUpdate>", error);
    message = "Erreur lors de l'actualisation de la plante";
    res.status(500).json({ message });
  }
};

export const plantDelete = async (req, res) => {
  let message;
  try {
    const plantToDelete = await findPlantById(req.params.id);
    const cancel = verifyUserCanMakeAction(plantToDelete, req.user);
    if (cancel) {
      message = cancel.message;
      return res.status(cancel.status).json({ message });
    }
    const activeOffersWithThisPlant = await findOfferByPlantId(
      plantToDelete.id
    );
    if (activeOffersWithThisPlant) {
      message =
        "Vous ne pouvez supprimer cette plante car il y à des offres en cours la concernant.";
      return res.status(409).json({ message });
    }
    await deletePlant(req.params.id);
    message = "La plante à bien été supprimé.";
    res.json({ message });
  } catch (error) {
    console.error("<plantController: plantDelete>", error);
    message = "Erreur lors de la suppression de la plante";
    res.status(500).json({ message });
  }
};
