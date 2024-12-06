import { Request, Response } from "express-serve-static-core";
import { asyncHandler } from "../../middleware/asyncHandler";
import { SessionService } from "./session.service";
import {
  BadRequestException,
  NotFoundException,
} from "../../common/utils/catch-errors";
import { session } from "passport";
import { HTTPSTATUS } from "../../config/http.config";
import { z } from "zod";

export class SessionController {
  private sessionService: SessionService;

  constructor(sessionService: SessionService) {
    this.sessionService = sessionService;
  }

  public getAllSessions = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new NotFoundException("User id not found, please login again.");
    }
    const sessionId = req.sessionId;

    const { sessions } = await this.sessionService.getAllSessions(userId);

    const modifySessions = sessions.map((session: any) => ({
      ...session.dataValues,
      ...(session.id === sessionId && { isCurrent: true }),
    }));

    return res.status(HTTPSTATUS.OK).json({
      message: "Retrieved all session successfully",
      sessions: modifySessions,
    });
  });

  public getSession = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = req.sessionId;

    if (!sessionId) {
      throw new NotFoundException("Session Id not found, please login again.");
    }

    const { user } = await this.sessionService.getSession(sessionId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Session retrieved successfully",
      user,
    });
  });

  public deleteSession = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = z.number().parse(+req.params.id);
    const userId = req.user?.id;

    if (!userId) {
      throw new NotFoundException("User id not found, please login again.");
    }

    await this.sessionService.deleteSession(sessionId, userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Session remove successfully",
    });
  });
}
