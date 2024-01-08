/**
 * take registered sequelize's models, and apply relations to each one
 * @param {Sequelize} sequelize
 */
export function applyAssociations(sequelize) {
  // console.log(sequelize.models);
  const {
    user,
    role,
    plant,
    offer,
    proposal,
    comment,
    rapport,
    waitingBotanist,
  } = sequelize.models;

  //User associations
  user.belongsToMany(role, { through: "userRole" });
  user.hasMany(plant);
  user.hasMany(proposal);
  user.hasMany(comment);
  user.hasMany(offer, {
    foreignKey: {
      name: "ownerId",
    },
    as: "owner",
  });
  user.hasMany(offer, {
    foreignKey: {
      name: "guardianId",
    },
    as: "guardian",
  });
  user.hasOne(waitingBotanist);

  //WaitingList associations
  waitingBotanist.belongsTo(user);

  //Role associations
  role.belongsToMany(user, { through: "userRole" });

  //Plant associations
  plant.belongsTo(user);
  plant.hasMany(offer);

  //Offer associations
  offer.belongsTo(plant);
  offer.hasMany(proposal);
  offer.hasMany(rapport);
  offer.belongsTo(user, {
    foreignKey: {
      name: "ownerId",
    },
    as: "owner",
  });
  offer.belongsTo(user, {
    foreignKey: {
      name: "guardianId",
    },
    as: "guardian",
  });

  //Proposal associations
  proposal.belongsTo(user);
  proposal.belongsTo(offer);

  //Comment associations
  comment.belongsTo(user);
  comment.belongsTo(rapport);

  //Rapport associations
  rapport.hasMany(comment);
  rapport.belongsTo(offer);
}
