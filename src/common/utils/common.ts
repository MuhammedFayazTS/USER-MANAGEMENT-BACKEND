import { Request } from "express";
import { BadRequestException } from "./catch-errors";

export function assertDefined<T>(
  value: T | undefined | null,
  msg?: string
): asserts value is T {
  if (value === undefined) {
    throw new BadRequestException(msg ?? "value cant be undefined");
  }
  if (value === null) {
    throw new BadRequestException(msg ?? "value cant be null");
  }
}

export const getPaginationInfo = (req: Request, itemCount: number) => {
  const limit = req?.query?.limit as any;
  const pageCount = Math.ceil(itemCount / limit);
  return { pageCount, itemCount };
};
