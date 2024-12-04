//Handle the buisness logic

import { ErrorCode } from "../../common/enums/error-code.enum";
import { VerificationEnum } from "../../common/enums/verification-code.enum";
import { RegisterDto } from "../../common/interfaces/auth.interface";
import { BadRequestException } from "../../common/utils/catch-errors";
import { fortyFiveMinutesFromNow } from "../../common/utils/date-time";
import db from "../../database/database";

export class AuthService {
  public async register(registerData: RegisterDto) {
    const { name, email, password } = registerData;
    const transaction = await db.createDBTransaction();

    const existingUser = await db.User.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException(
        "User already exists with this email",
        ErrorCode.AUTH_EMAIL_ALREADY_EXISTS
      );
    }

    const newUser = await db.User.create(
      {
        name,
        email,
        password,
      },
      { transaction }
    );

    const userId = newUser.id;

    const userPreference = await db.UserPreference.create(
      {
      userId,
      enable2FA: false, // Provide default values
      emailNotification: true, // Provide default values
    },
    {
      transaction
    }
  )

    const verificationCode = await db.VerificationCode.create(
      {
        userId,
        type: VerificationEnum.EMAIL_VERIFICATION,
        expiresAt: fortyFiveMinutesFromNow(),
      },
      { transaction }
    );

    transaction.commit();
    
    const userWithPreference = await db.User.findOne({
      where: { id: userId },
      include: [
        {
          model: db.UserPreference,
          as: "userPreference",
        },
      ],
    });

    return {
      user: userWithPreference.toJSON(),
    };
  }
}
