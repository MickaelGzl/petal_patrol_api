export const WaitingBotanistModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "waitingBotanist",
    {
      message: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
    }
  );
};
