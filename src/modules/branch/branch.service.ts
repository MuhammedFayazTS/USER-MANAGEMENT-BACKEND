import Sequelize from "sequelize";
import db from "../../database/database";
import { ErrorCode } from "../../common/enums/error-code.enum";
import { BranchAttributes } from "../../database/models/branch.model";
import {
  BranchDeleteNotAllowedException,
  NotFoundException,
} from "../../common/utils/catch-errors";
import { DefaultQueryParams } from "../../common/interfaces/query.interface";
import { FilterBuilder } from "../../common/utils/filter-builder";

export class BranchService {
  public async getAllBranches(query: DefaultQueryParams, skip?: number) {
    const filterBuilder = new FilterBuilder(query, ["name", "city", "state"]);
    const { order, where, limit, attributes, offset } =
      filterBuilder.buildFilters();

    const branches = await db.Branch.findAndCountAll({
      where,
      attributes: attributes || [
        "id",
        "name",
        "city",
        "state",
        "countryId",
        "address",
        "postalCode",
        "phone",
        "email",
        "image",
      ],
      include: [
        {
          model: db.Country,
          attributes: ["id", "name"],
        },
      ],
      order,
      limit,
      offset,
    });

    return branches;
  }

  public async getBranch(id: number | string) {
    const branch = await db.Branch.findOne({
      where: { id },
      include: [
        {
          model: db.Country,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!branch) {
      throw new NotFoundException(
        "Branch does not exist",
        ErrorCode.BRANCH_NOT_FOUND
      );
    }

    return branch;
  }

  public async getRolesForSelect() {
    const branches = await db.Branch.findAll({
      attributes: [
        [Sequelize.literal('"Branch"."id"'), "value"],
        [Sequelize.literal('"Branch"."name"'), "label"],
      ],
      order: [["name", "ASC"]],
    });
    return branches;
  }

  public async createBranch(branchData: BranchAttributes) {
    const newBranch = await db.Branch.create(branchData);
    if (!newBranch.id) {
      throw new Error("Failed to create branch");
    }

    return newBranch;
  }

  public async updateBranch(
    id: number | string,
    branchData: Partial<BranchAttributes>
  ) {
    const existingBranch = await db.Branch.findOne({ where: { id } });

    if (!existingBranch) {
      throw new NotFoundException(
        "Branch does not exist",
        ErrorCode.BRANCH_NOT_FOUND
      );
    }

    await existingBranch.update(branchData);
    return existingBranch;
  }

  public async deleteBranch(id: number | string) {
    const usage = await this.checkBranchUsage(id);
    if (usage) {
      throw new BranchDeleteNotAllowedException();
    }
    const deletedBranch = await db.Branch.destroy({
      where: { id },
    });

    return deletedBranch;
  }

  private async checkBranchUsage(branchId: number | string): Promise<boolean> {
    // const userCount = await db.User.count({
    //   where: { branchId },
    // });
    const roomCount = await db.Room.count({
      where: { branchId },
    });
    const roomTypeCount = await db.RoomType.count({
      where: { branchId },
    });
    const bookingCount = await db.Booking.count({
      where: { branchId },
    });
    return roomCount + bookingCount + roomTypeCount > 0;
  }
}
