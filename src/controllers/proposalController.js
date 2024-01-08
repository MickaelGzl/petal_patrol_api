import { verifyUserCanMakeAction } from "../config/authConfig.js";
import { findOfferById } from "../queries/offerQueries.js";
import {
  createProposal,
  deleteOfferProposals,
  deleteProposal,
  findProposalById,
  findProposalByOfferId,
  findProposalByUserId,
  updateProposal,
} from "../queries/proposalQueries.js";
import { updateOfferGuardian } from "./offerController.js";

export const proposalByUser = async (req, res) => {
  let message;
  try {
    const proposals = await findProposalByUserId(req.user.id);
    message = "La liste de vos réponses à bien été récupérée.";
    res.json({ message, proposals });
  } catch (error) {
    console.error("<proposalController: proposalByUser>", error);
    message = "Erreur lors de la récupération de vos propositions";
    res.status(500).json({ message });
  }
};

export const proposalByOffer = async (req, res) => {
  let message;
  try {
    const concernedOffer = await findOfferById(req.params.id);
    const cancel = verifyUserCanMakeAction(
      concernedOffer,
      req.user,
      true,
      "ownerId"
    );
    if (cancel) {
      message = cancel.message;
      return res.status(cancel.status).json({ message });
    }
    const offerProposals = await findProposalByOfferId(concernedOffer.id);
    message =
      "La liste des propositions correspondant à l'offre à bien été récupérée.";
    res.json({ message, offer: concernedOffer, proposals: offerProposals });
  } catch (error) {
    console.error("<proposalController: proposalByOffer>", error);
    message =
      "Erreur lors de la récupération des propositions liées à votre offre.";
    res.status(500).json({ message });
  }
};

export const proposalGetOne = async (req, res) => {
  let message;
  try {
    const proposal = await findProposalById(req.params.id, true);
    if (!proposal) {
      message = "Aucune réponse trouvé pour l'identifiant fournis.";
      return res.status(404).json({ message });
    }

    if (
      proposal.userId !== req.user.id &&
      proposal.offer.ownerId !== req.user.id
    ) {
      message = "Vous n'avez pas les droits.";
      return res.status(403).json({ message });
    }
    message = "Proposition récupérée.";
    res.json({ message, proposal });
  } catch (error) {
    console.error("<proposalController: proposalGetOne>", error);
    message = "Erreur lors de la récupération de la proposition.";
    res.status(500).json({ message });
  }
};

export const proposalCreate = async (req, res) => {
  let message;
  try {
    const concernedOffer = await findOfferById(req.params.id);
    if (
      !concernedOffer ||
      concernedOffer.guardianId ||
      concernedOffer.date_to < Date.now()
    ) {
      message = "L'offre à expiré ou à déjà reçu une réponse.";
      return res.status(409).json({ message });
    }
    const proposal = await createProposal(
      req.body.message,
      concernedOffer.id,
      req.user.id
    );
    message = "Votre proposition à bien été enregistrée.";
    return res.json({ message, proposal });
  } catch (error) {
    console.error("<proposalController: proposalCreate>", error);
    message = "Erreur lors de la création d'une proposition";
    res.status(500).json({ message });
  }
};

export const proposalUpdate = async (req, res) => {
  let message;
  try {
    const proposalToUpdate = await findProposalById(req.params.id);
    const cancel = verifyUserCanMakeAction(proposalToUpdate, req.user, false);
    if (cancel) {
      message = cancel.message;
      return res.status(cancel.status).json({ message });
    }
    const updatedProposal = await updateProposal(
      proposalToUpdate,
      req.body.message
    );
    message = "Votre message a bien été modifiée.";
    res.json({ message, proposal: updatedProposal });
  } catch (error) {
    console.error("<proposalController: proposalUpdate>", error);
    message = "Erreur lors de la modification de votre proposition";
    res.status(500).json({ message });
  }
};

export const proposalDelete = async (req, res) => {
  let message;
  try {
    const proposalToDelete = await findProposalById(req.params.id);
    const cancel = verifyUserCanMakeAction(proposalToDelete, req.user, true);
    if (cancel) {
      message = cancel.message;
      return res.status(cancel.status).json({ message });
    }
    await deleteProposal(proposalToDelete.id);
    message = "Votre proposition à bien été supprimée.";
    res.json({ message });
  } catch (error) {
    console.error("<proposalController: proposalDelete>", error);
    message = "Erreur lors de la suppression de votre proposition";
    res.status(500).json({ message });
  }
};

export const proposalResponse = async (req, res) => {
  let message;
  try {
    const { acceptance } = req.body;
    if (acceptance === undefined) {
      message = "Aucune réponse fourni dans la requête.";
      return res.status(404).json({ message });
    } else if (acceptance !== true && acceptance !== false) {
      message = `Attend une réponse de type booleen. Reçu: ${acceptance}`;
      return res.status(400).json({ message });
    }

    const proposal = await findProposalById(req.params.id, true);
    if (!proposal) {
      message = "Aucune ressource trouvée pour l'identifiant fournis.";
      return res.status(404).json({ message });
    }
    const cancel = verifyUserCanMakeAction(
      proposal.offer,
      req.user,
      false,
      "ownerId"
    );
    if (cancel) {
      message = cancel.message;
      return res.status(cancel.status).json({ message });
    }

    if (!acceptance) {
      await deleteProposal(req.params.id);
      message = "La proposition selectionnée à bien été ";
    } else {
      await updateOfferGuardian(
        await findOfferById(proposal.offer.id),
        proposal.userId
      );

      await deleteOfferProposals(proposal.offer.id);
    }
    message = `La proposition sélectionnée à bien été ${
      !acceptance
        ? "supprimée."
        : "acceptée. Les autres seront automatiquement supprimées."
    }`;
    return res.json({ message });
  } catch (error) {
    console.error("<proposalController: proposalResponse>", error);
    message =
      "Erreur lors de l'envoi de réponse à la proposiiton sélectionnée.";
    res.status(500).json({ message });
  }
};
