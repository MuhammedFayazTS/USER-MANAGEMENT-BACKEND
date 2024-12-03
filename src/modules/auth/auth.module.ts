// Orchestrate between the routes and the service layer.

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

const authService = new AuthService();
const authController = new AuthController(authService);

export { authController, authService };
