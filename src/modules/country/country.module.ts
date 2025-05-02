import { CountryController } from "./country.controller";
import { CountryService } from "./country.service";

const countryService = new CountryService();
const countryController = new CountryController(countryService);

export { countryService, countryController };
