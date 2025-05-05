import { RoomStatusController } from "./room-status.controller";
import { RoomStatusService } from "./room-status.service";


const roomStatusService = new RoomStatusService();
const roomStatusController = new RoomStatusController(roomStatusService);

export { roomStatusService, roomStatusController };
