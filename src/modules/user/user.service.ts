import { Op, Transaction } from "sequelize";
import {
  GoogleLoginUser,
  NewUser,
} from "../../common/interfaces/user.interface";
import { generateTempPassword } from "../../common/utils/auth";
import db from "../../database/database";
import { sendEmail } from "../../mailers/mailer";
import { config } from "../../config/app.config";
import { loginWithTempPassTemplate } from "../../mailers/templates/template";
import logger from "../../common/utils/logger";
import { DefaultQueryParams } from "../../common/interfaces/query.interface";
import { FilterBuilder } from "../../common/utils/filter-builder";
import { NotFoundException } from "../../common/utils/catch-errors";
import { ErrorCode } from "../../common/enums/error-code.enum";

export class UserService {
  public async findUserById(userId: number) {
    const user = await db.User.scope("withoutPassword").findOne({
      where: { id: userId },
      include: {
        model: db.UserPreference,
        attributes: ["userId", "enable2FA", "emailNotification"],
        as: "userPreference",
      },
    });
    return user || null;
  }

  public async findUserByEmail(email: string) {
    const user = await db.User.scope("withoutPassword").findOne({
      where: { email: email },
      include: {
        model: db.UserPreference,
        attributes: ["userId", "enable2FA", "emailNotification"],
        as: "userPreference",
      },
    });
    return user || null;
  }

  public async createUser(userDetails: GoogleLoginUser | NewUser) {
    const user = await db.User.create(userDetails);
    return user;
  }

  public async createUserWithTempPassword(userDetails: NewUser) {
    const transaction = await db.createDBTransaction();
    try {
      const tempPassword = await generateTempPassword(userDetails.firstName);
      const updatedUserDetails = { ...userDetails, password: tempPassword };
      const newUser = await db.User.create(updatedUserDetails, { transaction });
      logger.info(`User created with ID: ${newUser.id}`);
      await this.createUserPreference(newUser.id, transaction);
      logger.info(`User preferences created for user ID: ${newUser.id}`);

      const loginUrl = `${config.APP_ORIGIN}/?email=${newUser.email}&tempPass=${tempPassword}`;
      logger.debug(`Generated Login URL for user: ${newUser.email}`);

      await sendEmail({
        to: newUser.email,
        ...loginWithTempPassTemplate(
          loginUrl,
          newUser.email,
          tempPassword,
          "Nexus Flow"
        ),
      });
      logger.info(`Email sent to: ${newUser.email}`);

      await transaction.commit();

      return newUser;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async getAllUsers(query: DefaultQueryParams, userId: number) {
    const filterBuilder = new FilterBuilder(query, ["firstName", "lastName"]);
    const { order, where, limit, attributes, offset } =
      filterBuilder.buildFilters();
    where.id = { [Op.ne]: userId };
    const users = await db.User.findAndCountAll({
      where,
      attributes: attributes || [
        "id",
        "firstName",
        "lastName",
        "email",
        "isEmailVerified",
        "image",
        "roleId",
      ],
      include: [
        {
          model: db.UserPreference,
          attributes: ["enable2FA", "emailNotification", "twoFactorSecret"],
          as: "userPreference",
        },
        {
          model: db.Role,
          attributes: ["name"],
          as: "role",
        },
      ],
      order,
      limit,
      offset,
    });

    return users;
  }

  public async getUser(id: number | string) {
    const user = await db.User.findOne({
      where: { id },
      include: [],
    });

    if (!user) {
      throw new NotFoundException(
        "User does not exist",
        ErrorCode.USER_NOT_FOUND
      );
    }

    return user;
  }

  public async updateUser(id: number | string, newUser: NewUser) {
    const existingUser = await db.User.findOne({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(
        "User does not exist",
        ErrorCode.USER_NOT_FOUND
      );
    }

    await existingUser.update(newUser);
  }

  private createUserPreference = async (
    userId: number,
    transaction: Transaction
  ) => {
    const userPreference = await db.UserPreference.create(
      {
        userId,
      },
      {
        transaction,
      }
    );
  };
}
