import db from "../../database/database";
import { UserAttributes } from "../../database/models/user.model";

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

  public async createUser(userDetails: UserAttributes) {
    const user = await db.User.create(userDetails);
    return user;
  }
}
