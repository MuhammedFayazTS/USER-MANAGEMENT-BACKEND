import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { HTTPSTATUS } from "../../config/http.config";
import { assertDefined, getPaginationInfo } from "../../common/utils/common";
import { roomSchema } from "../../common/validators/room.validator";
import { RoomService } from "./room.service";

export class RoomController {
  constructor(private roomService: RoomService) {}

  public getRoom = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    assertDefined(id, "Room ID is required");

    const room = await this.roomService.getRoom(id);
    return res.status(HTTPSTATUS.OK).json({ message: "Room fetched", room });
  });

  public getAllRooms = asyncHandler(async (req: Request, res: Response) => {
    const rooms = await this.roomService.getAllRooms(req.query);

    return res.status(HTTPSTATUS.OK).json({
      message: "Rooms listed",
      rooms,
      ...getPaginationInfo(req, rooms.count),
    });
  });

  public getRoomsForSelect = asyncHandler(
    async (_req: Request, res: Response) => {
      const rooms = await this.roomService.getRoomsForSelect();

      return res.status(HTTPSTATUS.OK).json({
        message: "Rooms for select fetched",
        rooms,
      });
    }
  );

  public getRoomsByBookingStatus = asyncHandler(
    async (_req: Request, res: Response) => {
      const rooms = await this.roomService.getRoomsByBookingStatus();

      return res.status(HTTPSTATUS.OK).json({
        message: "Rooms for select fetched",
        rooms,
      });
    }
  );

  public createRoom = asyncHandler(async (req: Request, res: Response) => {
    const data = roomSchema.parse(req.body);

    const room = await this.roomService.createRoom(data);
    return res
      .status(HTTPSTATUS.CREATED)
      .json({ message: "Room created", room });
  });

  public updateRoom = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    assertDefined(id, "Room ID is required");

    const data = roomSchema.partial().parse(req.body);

    const room = await this.roomService.updateRoom(Number(id), data);
    return res.status(HTTPSTATUS.OK).json({ message: "Room updated", room });
  });

  public deleteRoom = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    assertDefined(id, "Room ID is required");

    await this.roomService.deleteRoom(id);
    return res.status(HTTPSTATUS.OK).json({ message: "Room deleted" });
  });
}
