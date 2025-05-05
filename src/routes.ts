import express from "express";
import authRoutes from "./modules/auth/auth.routes";
import { config } from "./config/app.config";
import sessionRoutes from "./modules/session/session.routes";
import { authenticateJwt } from "./common/strategies/jwt.strategy";
import mfaRoutes from "./modules/mfa/mfa.routes";
import roleRoutes from "./modules/role/role.routes";
import permissionRoutes from "./modules/permission/permisiion.routes";
import moduleRoutes from "./modules/module/module.routes";
import userRoutes from "./modules/user/user.routes";
import groupRoutes from "./modules/group/group.routes";
import countryRoutes from "./modules/country/country.routes";
import branchRoutes from "./modules/branch/branch.routes";
import roomTypeRoutes from "./modules/room-type/room-type.routes";
import roomStatusRoutes from "./modules/room-status/room-status.routes";

export const routes = (app: express.Application) => {
  const BASE_PATH = config.BASE_PATH;

  app.use(`${BASE_PATH}/auth`, authRoutes);
  app.use(`${BASE_PATH}/mfa`, mfaRoutes);
  app.use(`${BASE_PATH}/session`, authenticateJwt, sessionRoutes);
  app.use(`${BASE_PATH}/roles`, authenticateJwt, roleRoutes);
  app.use(`${BASE_PATH}/permissions`, authenticateJwt, permissionRoutes);
  app.use(`${BASE_PATH}/modules`, authenticateJwt, moduleRoutes);
  app.use(`${BASE_PATH}/users`, authenticateJwt, userRoutes);
  app.use(`${BASE_PATH}/groups`, authenticateJwt, groupRoutes);
  app.use(`${BASE_PATH}/countries`, authenticateJwt, countryRoutes);
  app.use(`${BASE_PATH}/branches`, authenticateJwt, branchRoutes);
  app.use(`${BASE_PATH}/room-types`, authenticateJwt, roomTypeRoutes);
  app.use(`${BASE_PATH}/room-statuses`, authenticateJwt, roomStatusRoutes);
};
