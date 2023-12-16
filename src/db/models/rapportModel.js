export const RapportModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "rapport",
    {
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rapport: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
};
