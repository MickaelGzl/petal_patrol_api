import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
import {
  UserModel,
  RoleModel,
  PlantModel,
  OfferModel,
  CommentModel,
  ProposalModel,
  RapportModel,
  WaitingBotanistModel,
} from "./models/index.js";
import { applyAssociations } from "./setup/associations.js";
import { createData } from "./datas/createDatas.js";

dotenv.config();

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: `${process.env.DATABASE_PATH}${process.env.DB_NAME}`,
  logging: false,
});

// export const sequelize = new Sequelize("epsi-mspr", "root", "", {
//   host: "localhost",
//   dialect:
//     "mysql" /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
//   logging: false,
// });

//declare models
export const User = UserModel(sequelize, DataTypes);
export const Role = RoleModel(sequelize, DataTypes);
export const Plant = PlantModel(sequelize, DataTypes);
export const Offer = OfferModel(sequelize, DataTypes);
export const Comment = CommentModel(sequelize, DataTypes);
export const Proposal = ProposalModel(sequelize, DataTypes);
export const Rapport = RapportModel(sequelize, DataTypes);
export const waitingBotanist = WaitingBotanistModel(sequelize, DataTypes);

//apply associations with our models
applyAssociations(sequelize);

/**
 * connect app to database
 * force: true will delete everything in db
 * then create test's datas
 */
export const connection = async () => {
  try {
    await sequelize.sync({ force: true });
    await createData();
    console.log("succesfull connection to Db");
  } catch (error) {
    console.error("Db connection error: ", error);
  }
};
