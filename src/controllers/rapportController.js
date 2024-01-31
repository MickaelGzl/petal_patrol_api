import { verifyUserCanMakeAction } from "../config/authConfig.js";
import { deleteFile, fileUploadConfig } from "../config/multerConfig.js";
import {
  findOfferByGuardianId,
  findOfferById,
} from "../queries/offerQueries.js";
import {
  createRapport,
  findAllRapport,
  findRapportById,
  findRapportByOfferId,
  updateRapport,
} from "../queries/rapportQueries.js";
const upload = fileUploadConfig("rapports");

const uploadRapportImages = async (req, res, next) => {
  let message;
  try {
    upload.single("image")(req, res, (err) => {
      if (err && err.code === "LIMIT_FILE_SIZE") {
        message =
          "Le fichier est trop volumineux. La taille maximate autorisée est de 1Mb.";
        res.status(400).json({ message });
        next(err);
      } else if (err && err.message === "type not allowed") {
        message = "Le type de fichier envoyé est invalide.";
        res.status(400).json({ message });
        next(err);
      } else if (err) {
        throw new Error(err);
      }
      next();
    });
  } catch (error) {
    console.error("code: ", error.code);
    console.error("<rapportController: uploadRapportImages>", error);
    message = "Une erreur est survenue lors du traitement des fichiers";
    res.status(500).json({ message });
    next(error);
  }
};

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
    res.json({ message, rapports, imageRoute: "/images/rapports" });
  } catch (error) {
    console.error("<rapportController: rapportGetAll>", error);
    message = "Une erreur est survenue lors de la récupération des rapports.";
    return res.status(500).json({ message });
  }
};

export const rapportGetMy = async (req, res) => {
  let message;
  try {
    const offersUserIsGuardian = await findOfferByGuardianId(req.user.id);
    if (offersUserIsGuardian.length === 0) {
      message = "Vous n'avez encore aucun rapport écris.";
      return res.json({ message });
    }
    const offerWithRapports = await Promise.all(
      offersUserIsGuardian.map(async (offer) => {
        return {
          offer,
          rapports: await findRapportByOfferId(offer.id),
          imageRoute: "/images/rapports",
        };
      })
    );

    message = "La liste de vos rapport à bien été récupérée";
    return res.json({ message, offers: offerWithRapports });
  } catch (error) {
    console.error("<rapportController: rapportGetMy>", error);
    message =
      "Une erreur est survenue lors de la récupération de vos rapports.";
    return res.status(500).json({ message });
  }
};

export const rapportByOfferId = async (req, res) => {
  let message;
  try {
    const offer = await findOfferById(req.params.id);
    const cancel =
      verifyUserCanMakeAction(offer, req.user, true, "ownerId") &&
      verifyUserCanMakeAction(offer, req.user, true, "guardianId");
    if (cancel) {
      message = cancel.message;
      return res.status(cancel.status).json({ message });
    }
    const rapports = await findRapportByOfferId(offer.id);
    message = "La liste des rapports relative à l'offre à bien été récupérée.";
    res.json({
      message,
      rapports,
      offer,
      imageRouteRapport: "/images/rapports",
    });
  } catch (error) {
    console.error("<rapportController: rapportByOffer>", error);
    message =
      "Une erreur est survenue lors de la récupération des rapports lié à l'offre recherchée.";
    return res.status(500).json({ message });
  }
};

export const rapportById = async (req, res) => {
  let message;
  try {
    const rapport = await findRapportById(req.params.id);

    const cancel =
      verifyUserCanMakeAction(
        rapport && rapport.offer.dataValues,
        req.user,
        true,
        "ownerId"
      ) &&
      verifyUserCanMakeAction(
        rapport && rapport.offer.dataValues,
        req.user,
        true,
        "guardianId"
      );
    if (cancel && !req.user.role.include("BOTANIST")) {
      message = cancel.message;
      return res.status(cancel.status).json({ message });
    }
    delete rapport.offer;
    message = "Le rapport à bien été récupéré.";
    res.json({ message, rapport });
  } catch (error) {
    console.error("<rapportController: rapportById>", error);
    message = "Une erreur est survenue lors de la récupération du rapport.";
    return res.status(500).json({ message });
  }
};

export const rapportCreate = [
  async (req, res, next) => {
    let message;
    try {
      const offer = await findOfferById(req.params.id);
      const cancel = verifyUserCanMakeAction(
        offer,
        req.user,
        false,
        "guardianId"
      );
      if (cancel) {
        message = cancel.message;
        res.status(cancel.status).json({ message });
        next(cancel.message);
      } else {
        req.offer = offer;
        next();
      }
    } catch (error) {
      console.error("<rapportController: rapportCreate>", error);
      message = "Une erreur est survenue lors de la récupération de l'offre";
      return res.status(500).json({ message });
    }
  },
  uploadRapportImages,
  async (req, res) => {
    let message;
    try {
      if (!req.file) {
        message = "Vous devez ajouter une image pour enregistrer un rapport";
        return res.status(400).json({ message });
      }
      const newRapport = await createRapport(
        { rapport: req.body.rapport, image: req.file.filename },
        req.offer.id
      );
      message = "Votre rapport à bien été enregistrée.";
      res.json({ message, rapport: newRapport });
    } catch (error) {
      console.error("<rapportController: rapportCreate>", error);
      message = "Une erreur est survenue lors de la création du rapport.";
      return res.status(500).json({ message });
    }
  },
];

export const rapportUpdate = async (req, res) => {
  let message;
  try {
    const rapportToUpdate = await findRapportById(req.params.id);
    const cancel = verifyUserCanMakeAction(
      rapportToUpdate && rapportToUpdate.offer.dataValues,
      req.user,
      true,
      "guardianId"
    );
    if (cancel) {
      message = cancel.message;
      return res.status(cancel.status).json({ message });
    }
    const updatedRapport = await updateRapport(rapportToUpdate, {
      rapport: req.body.rapport,
    });
    message = "Le rapport à été mis à jour.";
    res.json({ message, rapport: updatedRapport });
  } catch (error) {
    console.error("<rapportController: rapportUpdate>", error);
    message = "Une erreur est survenue lors de l'actualisation du rapport.";
    return res.status(500).json({ message });
  }
};

export const rapportUpdateImage = [
  async (req, res, next) => {
    let message;
    try {
      const rapportToUpdate = await findRapportById(req.params.id);
      const cancel = verifyUserCanMakeAction(
        rapportToUpdate && rapportToUpdate.offer.dataValues,
        req.user,
        true,
        "guardianId"
      );
      if (cancel) {
        message = cancel.message;
        res.status(cancel.status).json({ message });
        next(cancel.message);
      }
      req.rapport = rapportToUpdate;
      next();
    } catch (error) {
      console.error("<rapportController: rapportUpdateImage>", error);
      message =
        "Une erreur est survenue lors de la vérification d'autorisation d'upload.";
      return res.status(500).json({ message });
    }
  },
  uploadRapportImages,
  async (req, res) => {
    let message;
    try {
      deleteFile("rapports", req.rapport.image);
      const updatedRapport = await updateRapport(req.rapport, {
        image: req.file.filename,
      });
      message = "Le rapport à été mis à jour.";
      res.json({ message, rapport: updatedRapport });
    } catch (error) {
      console.error("<rapportController: rapportUpdateImage>", error);
      message =
        "Une erreur est survenue lors de l'actualisation de l'image du rapport.";
      return res.status(500).json({ message });
    }
  },
];

// export const rapportDelete = async (req, res) => {
//   let message;
//   try {
//     const rapport = await findRapportById(req.params.id);
//     const cancel = verifyUserCanMakeAction(
//       rapport && rapport.offer.datavalues,
//       req.user,
//       false,
//       "guardianId"
//     );
//     if (cancel) {
//       message = cancel.message;
//       res.status(cancel.status).json({ message });
//       next(cancel.message);
//     }
//     deleteFile("rapports", rapport.image);
//     await deleteRapport(rapport.id);
//     message = "Le rapport à bien été supprimé.";
//     res.json({ message, rapport });
//   } catch (error) {
//     console.error("<rapportController: rapportDelete>", error);
//     message = "Une erreur est survenue lors de la suppression du rapport.";
//     return res.status(500).json({ message });
//   }
// };
