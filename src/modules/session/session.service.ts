import { Op } from "sequelize";
import db from "../../database/database";
import { NotFoundException } from "../../common/utils/catch-errors";

export class SessionService {
  public async getAllSessions(userId: number) {
    const sessions = await db.Session.findAll({
      where: {
        userId,
        expiredAt: {
          [Op.gt]: new Date(),
        },
      },
      attributes: ["id", "userId", "userAgent", "createdAt", "expiredAt"],
      order: [["createdAt", "DESC"]],
    });

    return { sessions };
  }

  public async getSession(sessionId: number) {
    const session = await db.Session.findOne({
      where: {
        id:sessionId,
        expiredAt: {
          [Op.gt]: new Date(),
        },
      },
      attributes: ["id", "userId", "userAgent", "createdAt"],
      include: {
        model: db.User,
        attributes: ["id", "name", "email", "createdAt", "updatedAt"],
        as:'user'
      },
    });

    if (!session) {
      throw new NotFoundException("Session not found");
    }

    const { user } = session;

    return { user };
  }
}
