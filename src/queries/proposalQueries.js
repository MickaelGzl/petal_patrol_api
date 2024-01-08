import { Op } from "sequelize";
import { Offer, Proposal, User } from "../db/server.js";

export const findProposalByUserId = (userId) => {
  return Proposal.findAll({ where: { userId } });
};

export const findProposalByOfferId = (offerId) => {
  return Proposal.findAll({
    where: { offerId },
    include: [
      {
        model: User,
        attributes: ["name", "email", "id", "avatar"],
      },
    ],
  });
};

export const findProposalById = (id, needOffer = false) => {
  let options = {
    where: { id: { [Op.eq]: id } },
    include: [
      {
        model: User,
        attributes: ["name", "email", "id", "avatar"],
      },
    ],
  };

  if (needOffer) {
    options = {
      ...options,
      include: [
        ...options.include,
        { model: Offer, attributes: ["id", "ownerId"] },
      ],
    };
  }

  return Proposal.findOne(options);
};

export const createProposal = async (message, offerId, userId) => {
  const newProposal = await Proposal.create({ message });
  newProposal.setOffer(offerId);
  newProposal.setUser(userId);
  return newProposal.save();
};

export const updateProposal = (proposal, newValues) => {
  return proposal.update(newValues);
};

export const deleteProposal = (id) => {
  return Proposal.destroy({ where: { id } });
};

export const deleteOfferProposals = (offerId) => {
  return Proposal.destroy({ where: { offerId } });
};
