import { Router } from "express";
import { authenticateJwt } from "../../common/strategies/jwt.strategy";
import { mfaController } from "./mfa.module";

const mfaRoutes = Router()

mfaRoutes.get('/setup',authenticateJwt,mfaController.generateMFASetup)
mfaRoutes.post('/verify',authenticateJwt,mfaController.verifyMFASetup)
mfaRoutes.put('/revoke',authenticateJwt,mfaController.recokeMFA)

export default mfaRoutes;