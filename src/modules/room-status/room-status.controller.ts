import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { HTTPSTATUS } from "../../config/http.config";
import { assertDefined, getPaginationInfo } from "../../common/utils/common";
import { RoomStatusService } from "./room-status.service";
import { roomStatusSchema } from "../../common/validators/room-status.validator";

export class RoomStatusController {
  constructor(private roomStatusService: RoomStatusService) {}

  public getRoomStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    assertDefined(id, "Room status ID is not defined");

    const roomStatus = await this.roomStatusService.getRoomStatus(id);
    return res.status(HTTPSTATUS.OK).json({
      message: "Room status retrieved successfully",
      roomStatus,
    });
  });

  public getAllRoomStatuses = asyncHandler(async (req: Request, res: Response) => {
    const roomStatuses = await this.roomStatusService.getAllRoomStatuses(req.query);

    return res.status(HTTPSTATUS.OK).json({
      message: "Room statuses listed successfully",
      roomStatuses,
      ...getPaginationInfo(req, roomStatuses.count),
    });
  });

  public getRoomStatusesForSelect = asyncHandler(async (_req: Request, res: Response) => {
    const roomStatuses = await this.roomStatusService.getRoomStatusesForSelect();

    return res.status(HTTPSTATUS.OK).json({
      message: "Room statuses for select listed successfully",
      roomStatuses,
    });
  });

  public createRoomStatus = asyncHandler(async (req: Request, res: Response) => {
    const roomStatusData = roomStatusSchema.parse(req.body);

    const roomStatus = await this.roomStatusService.createRoomStatus(roomStatusData);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Room status created successfully",
      roomStatus,
    });
  });

  public updateRoomStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    assertDefined(id, "Room status ID is not defined");
    const roomStatusData = roomStatusSchema.partial().parse(req.body);

    const roomStatus = await this.roomStatusService.updateRoomStatus(Number(id), roomStatusData);

    return res.status(HTTPSTATUS.OK).json({
      message: "Room status updated successfully",
      roomStatus,
    });
  });

  public deleteRoomStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    assertDefined(id, "Room status ID is not defined");

    await this.roomStatusService.deleteRoomStatus(id);

    return res.status(HTTPSTATUS.OK).json({
      message: "Room status deleted successfully",
    });
  });
}
