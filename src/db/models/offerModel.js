export const OfferModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "offer",
    {
      description: {
        type: DataTypes.TEXT("long"),
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      zip: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      coordinates: {
        type: DataTypes.JSON,
      },
      allow_advices: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      advice: {
        type: DataTypes.TEXT("long"),
      },
      complete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      date_from: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      date_to: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
};
