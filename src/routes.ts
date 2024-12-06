import express from "express";
import authRoutes from "./modules/auth/auth.routes";
import { config } from "./config/app.config";
import sessionRoutes from "./modules/session/session.routes";
import { authenticateJwt } from "./common/strategies/jwt.strategy";

export const routes = (app: express.Application) => {
  const BASE_PATH = config.BASE_PATH;

  app.use(`${BASE_PATH}/auth`, authRoutes);
  app.use(`${BASE_PATH}/session`, authenticateJwt, sessionRoutes);
};
