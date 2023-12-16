export function applyAssociations(sequelize) {
  console.log("MODELS");
  console.log(sequelize.models);
  const { user, role, plant, offer, proposal, comment, rapport } =
    sequelize.models;

  //User associations
  user.belongsToMany(role, { through: "userRole" });
  user.hasMany(plant);
  user.hasMany(proposal);
  user.hasMany(comment);
  user.hasMany(offer, {
    foreignKey: {
      name: "ownerId",
    },
  });
  user.hasMany(offer, {
    foreignKey: {
      name: "guardianId",
    },
  });

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
  });
  offer.belongsTo(user, {
    foreignKey: {
      name: "guardianId",
    },
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
