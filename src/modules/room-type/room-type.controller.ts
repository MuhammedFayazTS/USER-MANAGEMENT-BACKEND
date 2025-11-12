import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { HTTPSTATUS } from "../../config/http.config";
import { assertDefined, getPaginationInfo } from "../../common/utils/common";
import { RoomTypeService } from "./room-type.service";
import { roomTypeSchema } from "../../common/validators/room-type.validator";

export class RoomTypeController {
  constructor(private roomTypeService: RoomTypeService) {}

  public getRoomType = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    assertDefined(id, "Room Type id is not defined");

    const roomType = await this.roomTypeService.getRoomType(id);
    return res.status(HTTPSTATUS.OK).json({
      message: "Room type retrieved successfully",
      roomType,
    });
  });

  public getAllRoomTypes = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query;
    const roomTypes = await this.roomTypeService.getAllRoomTypes(query);

    return res.status(HTTPSTATUS.OK).json({
      message: "All room types listed successfully",
      roomTypes,
      ...getPaginationInfo(req, roomTypes.count),
    });
  });

  public getRoomTypesForSelect = asyncHandler(async (_req: Request, res: Response) => {
    const roomTypes = await this.roomTypeService.getRoomTypesForSelect();

    return res.status(HTTPSTATUS.OK).json({
      message: "All room types for select listed successfully",
      roomTypes,
    });
  });

  public createRoomType = asyncHandler(async (req: Request, res: Response) => {
    const roomTypeData = roomTypeSchema.parse(req.body);

    const roomType = await this.roomTypeService.createRoomType(roomTypeData);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Room type created successfully",
      roomType,
    });
  });

  public updateRoomType = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    assertDefined(id, "Room type id is not defined");

    const roomTypeData = roomTypeSchema.partial().parse(req.body);

    const roomType = await this.roomTypeService.updateRoomType(Number(id), roomTypeData);

    return res.status(HTTPSTATUS.OK).json({
      message: "Room type updated successfully",
      roomType,
    });
  });

  public deleteRoomType = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    assertDefined(id, "Room type id is not defined");

    await this.roomTypeService.deleteRoomType(id);

    return res.status(HTTPSTATUS.OK).json({
      message: "Room type deleted successfully",
    });
  });
}
