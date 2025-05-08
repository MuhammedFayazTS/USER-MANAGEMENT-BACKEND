import { z } from "zod";

export const bookingSchema = z.object({
  roomId: z.number({ required_error: "Room ID is required" }),
  customerId: z.number({ required_error: "Customer ID is required" }),
  branchId: z.number({ required_error: "Branch ID is required" }),
  checkInDate: z.coerce.date({ required_error: "Check-in date is required" }),
  checkOutDate: z.coerce.date({ required_error: "Check-out date is required" }),
  status: z.enum(["booked", "checked-in", "checked-out", "cancelled"], {
    required_error: "Booking status is required",
  }),
  totalAmount: z
    .number({ required_error: "Total amount is required" })
    .nonnegative("Total amount must be positive"),
  netAmount: z
    .number({ required_error: "Net amount is required" })
    .nonnegative("Net amount must be positive"),
  discount: z
    .number()
    .nonnegative("Discount must be positive")
    .nullable()
    .optional(),
  tax: z.number().nonnegative("Tax must be positive").nullable().optional(),
  notes: z.string().nullable().optional(),
  createdBy: z.number({ required_error: "Created by (user) is required" }),
});
