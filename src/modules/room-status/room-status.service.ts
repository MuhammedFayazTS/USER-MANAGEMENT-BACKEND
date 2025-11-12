import db from "../../database/database";
import {
  DeleteNotAllowedException,
  NotFoundException,
} from "../../common/utils/catch-errors";
import { ErrorCode } from "../../common/enums/error-code.enum";
import { DefaultQueryParams } from "../../common/interfaces/query.interface";
import { FilterBuilder } from "../../common/utils/filter-builder";
import Sequelize from "sequelize";
import { RoomStatusAttributes } from "../../database/models/roomstatus.model";

export class RoomStatusService {
  public async getAllRoomStatuses(query: DefaultQueryParams) {
    const filterBuilder = new FilterBuilder(query, ["name"]);
    const { order, where, limit, offset, attributes } =
      filterBuilder.buildFilters();

    const roomStatuses = await db.RoomStatus.findAndCountAll({
      where,
      attributes: attributes || ["id", "name", "description"],
      order,
      limit,
      offset,
    });

    return roomStatuses;
  }

  public async getRoomStatus(id: number | string) {
    const roomStatus = await db.RoomStatus.findOne({ where: { id } });

    if (!roomStatus) {
      throw new NotFoundException(
        "Room status not found",
        ErrorCode.ROOM_STATUS_NOT_FOUND
      );
    }

    return roomStatus;
  }

  public async getRoomStatusesForSelect() {
    const roomStatuses = await db.RoomStatus.findAll({
      attributes: [
        [Sequelize.literal('"RoomStatus"."id"'), "value"],
        [Sequelize.literal('"RoomStatus"."name"'), "label"],
      ],
      order: [["name", "ASC"]],
    });
    return roomStatuses;
  }

  public async createRoomStatus(roomStatusData: RoomStatusAttributes) {
    return await db.RoomStatus.create(roomStatusData);
  }

  public async updateRoomStatus(
    id: number | string,
    roomStatusData: Partial<RoomStatusAttributes>
  ) {
    const existing = await db.RoomStatus.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(
        "Room status not found",
        ErrorCode.ROOM_STATUS_NOT_FOUND
      );
    }
    await existing.update(roomStatusData);
    return existing;
  }

  public async deleteRoomStatus(id: number | string) {
    const usage = await this.checkRoomStatusUsage(id);
    if (usage) {
      throw new DeleteNotAllowedException();
    }
    return await db.RoomStatus.destroy({ where: { id } });
  }

  private async checkRoomStatusUsage(
    statusId: number | string
  ): Promise<boolean> {
    const roomCount = await db.Room.count({
      where: { statusId },
    });
    return roomCount > 0;
  }
}
