import { dbConfig } from "../config/database.config";
import { config as appConfig } from "../config/app.config";
import { Sequelize, Transaction } from "sequelize";
import { DBInterface } from "./DBTypes";

const environment = appConfig.NODE_ENV as string as
  | "development"
  | "production"
  | "test";
const config = dbConfig[environment] as any;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const createDBTransaction: () => Promise<Transaction> = async () => {
  const transaction = await db.sequelize.transaction().catch((e: Error) => {
    console.log(e);
    throw e;
  });
  return transaction;
};

const connectDB = () => {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((err: Error) => {
      console.error("Unable to connect to the database:", err);
    });
};

// @ts-ignore
const db: DBInterface = {
  sequelize,
  Sequelize,
  connectDB,
  createDBTransaction,
};

export default db;
