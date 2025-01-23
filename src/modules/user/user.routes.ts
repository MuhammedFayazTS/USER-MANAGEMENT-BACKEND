import { Router } from "express";
import { userController } from "./user.module";
import { authenticateJwt } from "../../common/strategies/jwt.strategy";
import { uploadSingleMiddleware } from "../../middleware/multer";

const roleRoutes = Router();


roleRoutes.get(
  "/",
  authenticateJwt,
  userController.getAllUsers
);

roleRoutes.get(
  "/:id",
  authenticateJwt,
  userController.getUser
);

roleRoutes.post(
  "/create-with-temp-password",
  authenticateJwt,
  uploadSingleMiddleware("image"),
  userController.createUserWithTempPassword
);

roleRoutes.put(
  "/:id",
  authenticateJwt,
  uploadSingleMiddleware("image"),
  userController.updateUser
);

export default roleRoutes;
