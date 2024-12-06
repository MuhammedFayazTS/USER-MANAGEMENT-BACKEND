import { Router } from "express";
import { sessionController } from "./session.module";

const sessionRoutes = Router();

sessionRoutes.get("/all", sessionController.getAllSessions);
sessionRoutes.get("/", sessionController.getSession);

export default sessionRoutes;
