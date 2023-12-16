export const CommentModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "comment",
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
