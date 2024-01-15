import { verifyUserCanMakeAction } from "../config/authConfig.js";
import {
  createComment,
  deleteComment,
  findCommentById,
  findCommentByUserId,
  updateComment,
} from "../queries/commentQueries.js";
import { findRapportById } from "../queries/rapportQueries.js";

const verifyUserAction = async (req, res, next) => {
  let message;
  try {
    if (!req.user.role.includes("BOTANIST")) {
      message = "Vous ne pouvez pas effectuer cette action.";
      res.status(403).json({ message });
      next(message);
    }
    const comment = await findCommentById(req.params.id);
    const cancel = verifyUserCanMakeAction(comment, req.user);
    if (cancel) {
      message = cancel.message;
      res.status(cancel.status).json({ message });
      next(message);
    }
    req.comment = comment;
    next();
  } catch (error) {
    console.error("<commentController: verifyUserAction>", error);
    message = "Erreur lors du traitement de la requête.";
    res.status(500).json({ message });
    next(error);
  }
};

export const commentGetMy = async (req, res) => {
  let message;
  try {
    const commentsOfUser = await findCommentByUserId(req.user.id);
    const comments = commentsOfUser.map((comment) => {
      return {
        ...comment.dataValues,
        rapportUrl: `/rapport/${comment.rapportId}`,
      };
    });
    message = "La liste de vos commentaires à bien été récupérée.";
    res.json({ message, comments });
  } catch (error) {
    console.error("<commentController: commentGetAll>", error);
    message = "Erreur lors de la récupération de vos commentaires";
    res.status(500).json({ message });
  }
};

export const commentCreate = async (req, res) => {
  let message;
  try {
    if (!req.user.role.includes("BOTANIST")) {
      message = "Vous ne pouvez pas créer de commentaire à cet emplacement.";
      return res.status(403).json({ message });
    }
    if (!(await findRapportById(req.params.id))) {
      message = "Aucun rapport trouvé pour l'identifiant fournis.";
      return res.status(404).json({ message });
    }
    const comment = await createComment(
      req.body.message,
      req.params.id,
      req.user.id
    );
    message =
      "Votre commentaire à bien été ajouté au rapport de l'utilisateur.";
    res.json({ message, comment });
  } catch (error) {
    console.error("<commentController: commentCreate>", error);
    message = "Erreur lors de la création de votre commentaire";
    res.status(500).json({ message });
  }
};

export const commentUpdate = [
  verifyUserAction,
  async (req, res) => {
    let message;
    try {
      const updatedComment = await updateComment(req.comment, req.body.message);
      message = "Votre commentaire à correctement été mis à jour.";
      res.json({ message, comment: updatedComment });
    } catch (error) {
      console.error("<commentController: commentUpdate>", error);
      message = "Erreur lors de la modification de votre commentaire";
      res.status(500).json({ message });
    }
  },
];

export const commentDelete = [
  verifyUserAction,
  async (req, res) => {
    let message;
    try {
      await deleteComment(req.comment.id);
      message = "Votre commentaire à correctement été supprimé.";
      res.json({ message });
    } catch (error) {
      console.error("<commentController: commentDelete>", error);
      message = "Erreur lors de la suppression de votre commentaire";
      res.status(500).json({ message });
    }
  },
];
