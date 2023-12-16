export const ProposalModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "proposal",
    {
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
};
