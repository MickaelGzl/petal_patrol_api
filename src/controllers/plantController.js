import { unlink } from "fs";
import { verifyUserCanMakeAction } from "../config/authConfig.js";
import { fileUploadConfig } from "../config/multerConfig.js";
import {
  createPlant,
  deletePlant,
  findAllPlants,
  findPlantById,
  updatePlant,
} from "../queries/plantQueries.js";
import { findOfferByPlantId } from "./offerController.js";

const upload = fileUploadConfig("plants");

/**
 * return all plants registered in app. Can query name, type, owner and owner username.
 * Only admin can access this request
 */
export const plantFindAll = async (req, res) => {
  let message;
  try {
    const allPlants = await findAllPlants("all", req.query);
    message = "La liste des plantes à bien été récupérée.";
    res.json({
      message,
      plants: allPlants.map((plant) => {
        return {
          ...plant.dataValues,
          images: JSON.parse(plant.images),
          imageRoute: "/images/plants",
        };
      }),
    });
  } catch (error) {
    console.error("<plantController: plantFindAll>", error);
    message = "Erreur lors de la récupération de la liste des plantes";
    res.status(500).json({ message });
  }
};

/**
 * same function but for specific user.
 * @returns list of user plants
 */
export const plantByUser = async (req, res) => {
  let message;
  try {
    const allPlants = await findAllPlants("user", req.user.id);
    message = "La liste des plantes de l'utilisateur à bien été récupérée.";
    res.json({
      message,
      plants: allPlants.map((plant) => {
        return {
          ...plant.dataValues,
          images: JSON.parse(plant.images),
          imageRoute: "/images/plants",
        };
      }),
    });
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
    const cancel = verifyUserCanMakeAction(plant, req.user);
    if (cancel) {
      message = cancel.message;
      return res.status(cancel.status).json({ message });
    }
    message = "La plante correspondante à bien été récupérée.";
    res.json({ message, plant });
  } catch (error) {
    console.error("<plantController: plantById>", error);
    message = "Erreur lors de la récupération de la plante";
    res.status(500).json({ message });
  }
};

const uploadPlantImages = async (req, res, next) => {
  let message;
  try {
    upload.fields([{ name: "image", maxCount: 6 }])(req, res, (err) => {
      if (err && err.code === "LIMIT_FILE_SIZE") {
        message =
          "Le fichier est trop volumineux. La taille maximate autorisée est de 1Mb.";
        res.status(400).json({ message });
        next(err);
      } else if (err && err.message === "type not allowed") {
        message = "Le type de fichier envoyé est invalide.";
        res.status(400).json({ message });
        next(err);
      } else if (err && err.code === "LIMIT_UNEXPECTED_FILE") {
        res.status(400).json({ error: err, message });
        next(err);
      } else if (err) {
        throw new Error(err);
      }
      next();
    });
  } catch (error) {
    console.error("<plantController: uploadPlantImages>", error);
    message = "Une erreur est survenue lors du traitement des fichiers";
    res.status(500).json({ message });
    next(error);
  }
};

/**
 * create a plant with name, type and images.
 * associate new plant with logged user
 * @returns the new plant created
 */
export const plantCreate = [
  uploadPlantImages,
  async (req, res) => {
    let message;
    try {
      console.log("in create");
      const images = JSON.stringify(
        req.files["image"].map((image) => image.filename)
      );
      const { name, type } = req.body;
      const plant = await createPlant({ name, type, images }, req.user.id);
      message = "Une nouvelle plante à bien été crée.";
      return res.json({ message, plant });
    } catch (error) {
      console.error("<plantController: plantCreate>", error);
      message = "Erreur lors de la création de la plante";
      res.status(500).json({ message });
    }
  },
];

/**
 * update name and type of Plant.
 * Only owner and admin can make action if name isn't appropriated
 * @returns tje updated plant
 */
export const plantUpdate = async (req, res) => {
  let message;
  try {
    const plantToUpdate = await findPlantById(req.params.id);
    const cancel = verifyUserCanMakeAction(plantToUpdate, req.user);
    if (cancel) {
      message = cancel.message;
      return res.status(cancel.status).json({ message });
    }
    const { name, type } = req.body;
    const updatedPlant = await updatePlant(plantToUpdate, { name, type });
    message = "La plante à correctement été mise à jour.";
    res.json({ message, plant: updatedPlant });
  } catch (error) {
    console.error("<plantController: plantUpdate>", error);
    message = "Erreur lors de l'actualisation de la plante";
    res.status(500).json({ message });
  }
};

// export const plantAddImages = [
//   async (req, res, next) => {
//     console.log("images: ", req.body.images);
//     const plantToUpdate = await findPlantById(req.params.id);
//     if (!plantToUpdate || plantToUpdate.userId != req.user.id) {
//       message = "Vous ne pouvez pas effectuer cette action";
//       res.status(403).json({ message });
//       next("User cannot make action");
//     } else if (
//       JSON.parse(plantToUpdate.images).length + req.body.images.length >
//       6
//     ) {
//       message = "Vous ne pouvez pas uploader plus de 6 images pour vos plantes";
//       res.status(400).json({ message });
//       next("user cannot make action");
//     } else {
//       next();
//     }
//   },
//   uploadPlantImages,
//   async (req, res) => {
//     let message;
//     try {
//       const plantToUpdate = await findPlantById(req.params.id);

//       const images = JSON.stringify(
//         req.files["image"].map((image) => `/images/plants/${image.filename}`)
//       );

//       const updatedPlant = await updatePlant(plantToUpdate, { images });
//       message = "Une nouvelle plante à bien été crée.";
//       return res.json({ message, plant });
//     } catch (error) {
//       console.error("<plantController: plantCreate>", error);
//       message = "Erreur lors de la création de la plante";
//       res.status(500).json({ message });
//     }
//   },
// ];

// export const plantDeteleImages = async(req, res) =>{}

/**
 * delete a specific plant.
 * Only owner can delete his plants
 * To be deleted, plant need to haven't offers related to.
 */
export const plantDelete = async (req, res) => {
  let message;
  try {
    const plantToDelete = await findPlantById(req.params.id);
    const cancel = verifyUserCanMakeAction(plantToDelete, req.user);
    if (!plantToDelete || plantToDelete.userId != req.user.id) {
      message = "Vous ne pouvez pas effectuer cette action";
      return res.status(403).json({ message });
    }
    const activeOffersWithThisPlant = await findOfferByPlantId(
      plantToDelete.id
    );
    if (activeOffersWithThisPlant) {
      message =
        "Vous ne pouvez supprimer cette plante car il y a des offres en cours la concernant.";
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
