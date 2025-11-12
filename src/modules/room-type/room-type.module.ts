import { RoomTypeController } from "./room-type.controller";
import { RoomTypeService } from "./room-type.service";

const roomTypeService = new RoomTypeService();
const roomTypeController = new RoomTypeController(roomTypeService);

export { roomTypeService, roomTypeController };
