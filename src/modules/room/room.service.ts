import db from "../../database/database";
import { RoomAttributes } from "../../database/models/room.model";
import {
  DeleteNotAllowedException,
  NotFoundException,
} from "../../common/utils/catch-errors";
import { ErrorCode } from "../../common/enums/error-code.enum";
import { FilterBuilder } from "../../common/utils/filter-builder";
import { DefaultQueryParams } from "../../common/interfaces/query.interface";
import Sequelize from "sequelize";

export class RoomService {
  public async getAllRooms(query: DefaultQueryParams) {
    const filterBuilder = new FilterBuilder(query, ["number"]);
    const { order, where, limit, offset, attributes } =
      filterBuilder.buildFilters();

    return await db.Room.findAndCountAll({
      where,
      order,
      limit,
      offset,
      attributes: attributes || [
        "id",
        "number",
        "typeId",
        "statusId",
        "branchId",
      ],
      include: [
        { model: db.RoomType, as: "type", attributes: ["id", "name", "price"] },
        { model: db.RoomStatus, as: "status", attributes: ["id", "name"] },
        { model: db.Branch, attributes: ["id", "name"] },
      ],
    });
  }

  public async getRoom(id: number | string) {
    const room = await db.Room.findOne({
      where: { id },
      include: [
        { model: db.RoomType, as: "type" },
        { model: db.RoomStatus, as: "status" },
        { model: db.Branch },
      ],
    });

    if (!room) {
      throw new NotFoundException("Room not found", ErrorCode.ROOM_NOT_FOUND);
    }

    return room;
  }

  public async getRoomsForSelect() {
    return await db.Room.findAll({
      attributes: [
        [Sequelize.literal('"Room"."id"'), "value"],
        [Sequelize.literal('"Room"."number"'), "label"],
      ],
      order: [["number", "ASC"]],
    });
  }

  public async createRoom(data: RoomAttributes) {
    return await db.Room.create(data);
  }

  public async updateRoom(id: number | string, data: Partial<RoomAttributes>) {
    const room = await db.Room.findOne({ where: { id } });
    if (!room) {
      throw new NotFoundException("Room not found", ErrorCode.ROOM_NOT_FOUND);
    }
    await room.update(data);
    return room;
  }

  public async deleteRoom(id: number | string) {
    const usage = await this.checkRoomUsage(id);
    if (usage) {
      throw new DeleteNotAllowedException();
    }
    return await db.Room.destroy({ where: { id } });
  }

  private async checkRoomUsage(roomId: number | string): Promise<boolean> {
    const bookingCount = await db.Booking.count({
      where: { roomId },
    });
    return bookingCount > 0;
  }
}
