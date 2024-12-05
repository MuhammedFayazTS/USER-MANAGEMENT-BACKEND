import fs from "fs";

import path from "path";
import { config as appConfig } from "../config/app.config";
import { DataTypes, Sequelize, Transaction } from "sequelize";
import { DBInterface, Models } from "./DBTypes";

const environment = appConfig.NODE_ENV as string as
  | "development"
  | "production"
  | "test";

const basename = path.basename(__filename);
const dbConfigPath = path.resolve(__dirname, "../config/database.config.js");
const dbConfig = require(dbConfigPath);
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

const modelsPath = path.resolve(__dirname, "models");

fs.readdirSync(modelsPath)
  .filter((file: any) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      (file.slice(-3) === ".js" || file.slice(-3) === ".ts")
    );
  })
  .forEach((file: any) => {
    const model = require(path.join(modelsPath, file))(sequelize, DataTypes);
    db[model.name as Models] = model; // Dynamically add the model to the db object
  });

// Establish associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default db;
