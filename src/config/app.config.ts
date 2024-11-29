import { getEnv } from "../common/utils/get-env";

const appConfig = () => ({
  NODE_ENV: getEnv("NODE_ENV", "development"),
  APP_ORIGIN: getEnv("APP_ORIGIN", "localhost"),
  PORT: getEnv("PORT", "5000"),
  BASE_PATH: getEnv("BASE_PATH", "/api/v1"),
  JWT: {
    JWT_SECRET: getEnv("JWT_SECRET"),
    JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "15m"),
    JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET"),
    JWT_REFRESH_EXPIRES_IN: getEnv("JWT_REFRESH_EXPIRES_IN", "30d"),
  },
});

export const config = appConfig();
