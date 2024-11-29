import { config } from "./app.config";

const dbConfig = {
  development: {
    username: config.DB.DB_USERNAME,
    password: config.DB.DB_PASSWORD,
    database: config.DB.DB,
    host: "127.0.0.1",
    dialect: "postgres",
  },
  test: {
    username: "postgres",
    password: "postgres",
    database: "kitchen_mate_test",
    host: "127.0.0.1",
    dialect: "postgres",
    logging: false,
  },
  production: {
    username: config.DB.DB_USERNAME,
    password: config.DB.DB_PASSWORD,
    database: config.DB.DB,
    host: config.DB.DB_HOST,
    use_env_variable: "DATABASE_URL",
    ssl: false,
    dialectOptions: {
      ssl: false,
    },
    dialect: "postgres",
  },
};

export { dbConfig };
