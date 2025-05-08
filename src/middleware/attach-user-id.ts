import { NextFunction, Request, Response } from "express";

export const attachUserId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  switch (req.method) {
    case "POST":
      req.body.createdBy = req.user?.id;
      req.body.updatedBy = req.user?.id;
      break;

    case "PUT":
    case "PATCH":
      req.body.updatedBy = req.user?.id;
      break;

    case "DELETE":
      req.body.deletedBy = req.user?.id;
      break;
  }

  next();
};
