import { Router } from "express";
import { roomController } from "./room.module";

const roomRoutes = Router();

roomRoutes.get("/", roomController.getAllRooms);
roomRoutes.get("/select", roomController.getRoomsForSelect);
roomRoutes.get("/select/status", roomController.getRoomsByBookingStatus);
roomRoutes.get("/:id", roomController.getRoom);
roomRoutes.post("/", roomController.createRoom);
roomRoutes.put("/:id", roomController.updateRoom);
roomRoutes.delete("/:id", roomController.deleteRoom);

export default roomRoutes;
