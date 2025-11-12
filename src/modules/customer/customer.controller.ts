import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { HTTPSTATUS } from "../../config/http.config";
import { assertDefined, getPaginationInfo } from "../../common/utils/common";
import { CustomerService } from "./customer.service";
import { customerSchema } from "../../common/validators/customer.validator";

// TODO:CUSTOMER ID PROOF UPLOAD

export class CustomerController {
  constructor(private customerService: CustomerService) {}

  public getCustomer = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    assertDefined(id, "Customer ID is required");

    const customer = await this.customerService.getCustomer(id);
    return res.status(HTTPSTATUS.OK).json({ message: "Customer fetched", customer });
  });

  public getAllCustomers = asyncHandler(async (req: Request, res: Response) => {
    const customers = await this.customerService.getAllCustomers(req.query);

    return res.status(HTTPSTATUS.OK).json({
      message: "Customers listed",
      customers,
      ...getPaginationInfo(req, customers.count),
    });
  });

  public getCustomersForSelect = asyncHandler(async (_req: Request, res: Response) => {
    const customers = await this.customerService.getCustomersForSelect();

    return res.status(HTTPSTATUS.OK).json({
      message: "Customers for select fetched",
      customers,
    });
  });

  public createCustomer = asyncHandler(async (req: Request, res: Response) => {
    const data = customerSchema.parse(req.body);

    const customer = await this.customerService.createCustomer(data);
    return res.status(HTTPSTATUS.CREATED).json({ message: "Customer created", customer });
  });

  public updateCustomer = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    assertDefined(id, "Customer ID is required");

    const data = customerSchema.partial().parse(req.body);

    const customer = await this.customerService.updateCustomer(Number(id), data);
    return res.status(HTTPSTATUS.OK).json({ message: "Customer updated", customer });
  });

  public deleteCustomer = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    assertDefined(id, "Customer ID is required");

    await this.customerService.deleteCustomer(id);
    return res.status(HTTPSTATUS.OK).json({ message: "Customer deleted" });
  });
}
