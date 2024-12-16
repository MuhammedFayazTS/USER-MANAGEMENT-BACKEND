// Orchestrate between the routes and the service layer.

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GoogleAuthService } from "./google.service";

const authService = new AuthService();
const googleService = new GoogleAuthService();
const authController = new AuthController(authService,googleService);

export { authController, authService };
