import { Router } from "express";
import { roomStatusController } from "./room-status.module";

const roomStatusRoutes = Router();

roomStatusRoutes.get("/", roomStatusController.getAllRoomStatuses);
roomStatusRoutes.get("/select", roomStatusController.getRoomStatusesForSelect);
roomStatusRoutes.get("/:id", roomStatusController.getRoomStatus);
roomStatusRoutes.post("/", roomStatusController.createRoomStatus);
roomStatusRoutes.put("/:id", roomStatusController.updateRoomStatus);
roomStatusRoutes.delete("/:id", roomStatusController.deleteRoomStatus);

export default roomStatusRoutes;
