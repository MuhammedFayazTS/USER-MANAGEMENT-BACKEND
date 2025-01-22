import { Router } from "express";
import { userController } from "./user.module";
import { authenticateJwt } from "../../common/strategies/jwt.strategy";
import { uploadSingleMiddleware } from "../../middleware/multer";

const roleRoutes = Router();

roleRoutes.post(
  "/create-with-temp-password",
  authenticateJwt,
  uploadSingleMiddleware("image"),
  userController.createUserWithTempPassword
);

export default roleRoutes;
