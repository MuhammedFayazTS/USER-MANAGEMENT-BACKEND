import { UserAttributes } from "../database/models/user.model"

declare global {
    namespace Express {
        interface User extends UserAttributes {}
        interface Request {
            sessionId?: number;
        }
    }
}