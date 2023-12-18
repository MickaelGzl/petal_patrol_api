export const PlantModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "plant",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
};
