import { Router } from "express";
import { countryController } from "./country.module";

const countryRoutes = Router();

countryRoutes.get("/select", countryController.getCountriesForSelect);

export default countryRoutes;
