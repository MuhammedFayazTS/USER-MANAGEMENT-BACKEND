import { Router } from "express";
import { authController } from "./auth.module";
import { authenticateJwt } from "../../common/strategies/jwt.strategy";
import passport from "passport";

const authRoutes = Router();

authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.post("/verify/email", authController.verifyEmail);
authRoutes.post("/password/forgot", authController.forgotPassword);
authRoutes.post("/password/reset", authController.resetPassword);
authRoutes.post("/logout", authenticateJwt, authController.logout);

//google auth
authRoutes.get("/google", passport.authenticate("google", { scope: ['profile', 'email'] }));
authRoutes.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/register" }),
  authController.googleLogin
);

authRoutes.get("/refresh", authController.refreshToken);

export default authRoutes;
