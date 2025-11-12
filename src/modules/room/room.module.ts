import { RoomController } from "./room.controller";
import { RoomService } from "./room.service";


const roomService = new RoomService();
const roomController = new RoomController(roomService);

export { roomService, roomController };
