import { Router } from "express";
import { roomTypeController } from "./room-type.module";

const roomTypeRoutes = Router();

roomTypeRoutes.get("/", roomTypeController.getAllRoomTypes);
roomTypeRoutes.get("/select", roomTypeController.getRoomTypesForSelect);
roomTypeRoutes.get("/:id", roomTypeController.getRoomType);
roomTypeRoutes.post("/", roomTypeController.createRoomType);
roomTypeRoutes.put("/:id", roomTypeController.updateRoomType);
roomTypeRoutes.delete("/:id", roomTypeController.deleteRoomType);

export default roomTypeRoutes;
