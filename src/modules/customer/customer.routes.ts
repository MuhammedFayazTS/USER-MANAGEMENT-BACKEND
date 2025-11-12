import { Router } from "express";
import { customerController } from "./customer.module";

const customerRoutes = Router();

customerRoutes.get("/", customerController.getAllCustomers);
customerRoutes.get("/select", customerController.getCustomersForSelect);
customerRoutes.get("/:id", customerController.getCustomer);
customerRoutes.post("/", customerController.createCustomer);
customerRoutes.put("/:id", customerController.updateCustomer);
customerRoutes.delete("/:id", customerController.deleteCustomer);

export default customerRoutes;
