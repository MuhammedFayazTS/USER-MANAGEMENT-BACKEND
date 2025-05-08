import db from "../../database/database";
import { CustomerAttributes } from "../../database/models/customer.model";
import {
  DeleteNotAllowedException,
  NotFoundException,
} from "../../common/utils/catch-errors";
import { ErrorCode } from "../../common/enums/error-code.enum";
import { FilterBuilder } from "../../common/utils/filter-builder";
import { DefaultQueryParams } from "../../common/interfaces/query.interface";
import Sequelize from "sequelize";

export class CustomerService {
  public async getAllCustomers(query: DefaultQueryParams) {
    const filterBuilder = new FilterBuilder(query, [
      "firstName",
      "email",
      "phone",
    ]);
    const { order, where, limit, offset, attributes } =
      filterBuilder.buildFilters();

    return await db.Customer.findAndCountAll({
      where,
      order,
      limit,
      offset,
      attributes: attributes || [
        "id",
        "firstName",
        "lastName",
        "email",
        "phone",
        "address",
        "city",
        "countryId",
      ],
      include: [
        {
          model: db.CustomerIdProof,
          as: "idProofs",
        },
        {
          model: db.Country,
          attributes: ["code", "name"],
        },
      ],
    });
  }

  public async getCustomer(id: number | string) {
    const customer = await db.Customer.findOne({
      where: { id },
      include: [
        {
          model: db.CustomerIdProof,
          as: "idProofs",
        },
      ],
    });

    if (!customer) {
      throw new NotFoundException(
        "Customer not found",
        ErrorCode.CUSTOMER_NOT_FOUND
      );
    }

    return customer;
  }

  public async getCustomersForSelect() {
    return await db.Customer.findAll({
      attributes: [
        [Sequelize.literal('"Customer"."id"'), "value"],
        [
          Sequelize.literal(
            `"Customer"."firstName" || ' ' || COALESCE("Customer"."lastName", '')`
          ),
          "label",
        ],
      ],
      order: [["firstName", "ASC"]],
    });
  }

  public async createCustomer(data: CustomerAttributes) {
    return await db.Customer.create(data);
  }

  public async updateCustomer(
    id: number | string,
    data: Partial<CustomerAttributes>
  ) {
    const customer = await db.Customer.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(
        "Customer not found",
        ErrorCode.CUSTOMER_NOT_FOUND
      );
    }
    await customer.update(data);
    return customer;
  }

  public async deleteCustomer(id: number | string) {
    const usage = await this.checkCustomerUsage(id);
    if (usage) {
      throw new DeleteNotAllowedException();
    }
    return await db.Customer.destroy({ where: { id } });
  }

  private async checkCustomerUsage(customerId: number | string): Promise<boolean> {
    const bookingCount = await db.Booking.count({
      where: { customerId },
    });
    return bookingCount > 0;
  }
}
