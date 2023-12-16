export const RoleModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "role",
    {
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
