import { UUIDV4 } from "sequelize";

export const UserModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "user",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatar: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          registerLocally(value) {
            if (!this.googleID && !value) {
              throw new Error("password required");
            }
          },
        },
      },
      googleId: {
        type: DataTypes.STRING,
      },
      password_token: {
        type: DataTypes.STRING,
      },
      password_token_expiration: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      activation_token: {
        type: DataTypes.STRING,
        defaultValue: UUIDV4(),
      },
      validate_account: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: true,
    }
  );
};
