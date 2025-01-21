import { Router } from "express";
import { userController } from "./user.module";
import { authenticateJwt } from "../../common/strategies/jwt.strategy";

const roleRoutes = Router();

roleRoutes.post(
  "/create-with-temp-password",
  authenticateJwt,
  userController.createUserWithTempPassword
);

export default roleRoutes;
