import express from "express";
import authRoutes from "./modules/auth/auth.routes";
import { config } from "./config/app.config";

export const routes = (app: express.Application) => {
  const BASE_PATH = config.BASE_PATH;

  app.use(`${BASE_PATH}/auth`, authRoutes);
};
