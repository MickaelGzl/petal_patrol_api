import { findAllPlants, findPlantById } from "../queries/plantQueries.js";

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
      message = "Vous n'avez pas els droits d'accès à cette ressource.";
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
    const plant = await createPlant(req.body);
  } catch (error) {
    console.error("<plantController: plantCreate>", error);
    message = "Erreur lors de la création de la plante";
    res.status(500).json({ message });
  }
};
