import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { SessionAttributes } from "../../database/models/session.model";
import { UserAttributes } from "../../database/models/user.model";
import { config } from "../../config/app.config";

export type AccessTPayload = {
  userId: UserAttributes["id"];
  sessionId: SessionAttributes["id"];
};

export type RefreshTPayload = {
  sessionId: SessionAttributes["id"];
};

type SignOptsAndSecret = SignOptions & {
  secret: string;
};

const defaults: SignOptions = {
  audience: ["user"],
};

export const accessTokenSignOptions: SignOptsAndSecret = {
  expiresIn: config.JWT.JWT_EXPIRES_IN,
  secret: config.JWT.JWT_SECRET,
};

export const refreshTokenSignOptions: SignOptsAndSecret = {
  expiresIn: config.JWT.JWT_REFRESH_EXPIRES_IN,
  secret: config.JWT.JWT_REFRESH_SECRET,
};

export const signJwtToken = (
  payload: AccessTPayload | RefreshTPayload,
  options?: SignOptsAndSecret
) => {
  const { secret, ...opts } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, {
    ...defaults,
    ...opts,
  });
};

export const verifyJwtToken = <TPayload extends object = AccessTPayload> (
  token: string,
  options?: VerifyOptions & { secret: string }
) => {
  try {
    const { secret = config.JWT.JWT_SECRET, ...opts } = options || {};
    const payload = jwt.verify(token, secret, {
      ...defaults,
      ...opts,
    }) as TPayload;
    return { payload };
  } catch (err: any) {
    return {
      error: err.message,
    };
  }
};
