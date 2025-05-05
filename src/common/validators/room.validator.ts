import { z } from "zod";

export const roomSchema = z.object({
  number: z.string().min(1, "Room number is required"),
  typeId: z.number({ required_error: "Room type is required" }),
  statusId: z.number({ required_error: "Room status is required" }),
  branchId: z.number({ required_error: "Branch is required" }),
});
