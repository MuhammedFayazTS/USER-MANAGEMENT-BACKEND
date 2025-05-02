import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { HTTPSTATUS } from "../../config/http.config";
import { CountryService } from "./country.service";

export class CountryController {
  private countryService: CountryService;
  constructor(countryService: CountryService) {
    this.countryService = countryService;
  }

  public getCountriesForSelect = asyncHandler(
    async (req: Request, res: Response) => {
      const countries = await this.countryService.getCountriesForSelect();

      return res.status(HTTPSTATUS.OK).json({
        message: "All countries for select are listed successfully",
        countries,
      });
    }
  );
}
