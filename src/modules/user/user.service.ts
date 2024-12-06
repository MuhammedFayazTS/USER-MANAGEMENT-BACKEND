import db from "../../database/database";

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
}
