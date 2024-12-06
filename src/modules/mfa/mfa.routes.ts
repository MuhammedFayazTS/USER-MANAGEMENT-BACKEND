import { Router } from "express";
import { authenticateJwt } from "../../common/strategies/jwt.strategy";
import { mfaController } from "./mfa.module";

const mfaRoutes = Router()

mfaRoutes.get('/setup',authenticateJwt,mfaController.generateMFASetup)

export default mfaRoutes;