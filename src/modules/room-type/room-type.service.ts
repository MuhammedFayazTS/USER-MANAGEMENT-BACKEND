import db from "../../database/database";
import {
  DeleteNotAllowedException,
  NotFoundException,
} from "../../common/utils/catch-errors";
import { ErrorCode } from "../../common/enums/error-code.enum";
import { DefaultQueryParams } from "../../common/interfaces/query.interface";
import { FilterBuilder } from "../../common/utils/filter-builder";
import Sequelize from "sequelize";
import { RoomTypeAttributes } from "../../database/models/roomtype.model";

export class RoomTypeService {
  public async getAllRoomTypes(query: DefaultQueryParams) {
    const filterBuilder = new FilterBuilder(query, ["name", "price"]);
    const { order, where, limit, offset, attributes } =
      filterBuilder.buildFilters();

    const roomTypes = await db.RoomType.findAndCountAll({
      where,
      attributes: attributes || ["id", "name", "price", "description"],
      include: [
        {
          model: db.Branch,
          attributes: ["id", "name"],
        },
      ],
      order,
      limit,
      offset,
    });

    return roomTypes;
  }

  public async getRoomType(id: number | string) {
    const roomType = await db.RoomType.findOne({
      where: { id },
      include: [
        {
          model: db.Branch,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!roomType) {
      throw new NotFoundException(
        "Room type not found",
        ErrorCode.ROOM_TYPE_NOT_FOUND
      );
    }

    return roomType;
  }

  public async getRoomTypesForSelect() {
    const roomTypes = await db.RoomType.findAll({
      attributes: [
        [Sequelize.literal('"RoomType"."id"'), "value"],
        [Sequelize.literal('"RoomType"."name"'), "label"],
      ],
      order: [["name", "ASC"]],
    });
    return roomTypes;
  }

  public async createRoomType(roomTypeData: RoomTypeAttributes) {
    const newRoomType = await db.RoomType.create(roomTypeData);
    return newRoomType;
  }

  public async updateRoomType(
    id: number | string,
    roomTypeData: Partial<RoomTypeAttributes>
  ) {
    const existing = await db.RoomType.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(
        "Room type not found",
        ErrorCode.ROOM_TYPE_NOT_FOUND
      );
    }
    await existing.update(roomTypeData);
    return existing;
  }

  public async deleteRoomType(id: number | string) {
    const usage = await this.checkRoomTypeUsage(id);
    if (usage) {
      throw new DeleteNotAllowedException();
    }
    return await db.RoomType.destroy({ where: { id } });
  }

  private async checkRoomTypeUsage(typeId: number | string): Promise<boolean> {
    const roomCount = await db.Room.count({
      where: { typeId },
    });
    return roomCount > 0;
  }
}
