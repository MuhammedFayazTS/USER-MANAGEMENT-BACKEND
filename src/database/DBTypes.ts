import { Sequelize, Transaction } from "sequelize";

export type Models =
  | "User"
  | "UserPreference"
  | "Session"
  | "VerificationCode"
  | "Role"
  | "Permission"
  | "RolePermission"
  | "Group"
  | "GroupRole"
  | "UserGroup"
  | "Module" 
  | "ModulePermission" 
  | "Room" 
  | "RoomType" 
  | "RoomStatus" 
  | "Customer" 
  | "CustomerIdProof" 
  | "Booking" 
  | "Payment" 
  | "PaymentMode" 
  | "Country" 
  ;

type ModelProps = {
  [M in Models]: {
    create: (
      payload: {},
      options?: { transaction?: Transaction }
    ) => Promise<any>;
    update: (
      payload: {},
      options?: { transaction?: Transaction }
    ) => Promise<any>;
    bulkCreate: (
      payload: {},
      options?: { transaction?: Transaction; updateOnDuplicate?: string[] }
    ) => Promise<any>;
    findOne: (params: IFindOptions) => Promise<any>;
    findAll: (params: IFindOptions) => Promise<any>;
    findAndCountAll: (params: IFindOptions) => Promise<any>;
    count: (params: IFindOptions) => Promise<number>;
    destroy: (options?: {
      where?: {};
      transaction?: Transaction;
    }) => Promise<number>;
    scope: (
      ...scopeNames: (string | undefined | null)[]
    ) => Omit<ModelProps[M], "scope">;
  };
};

interface IFindOptions {
  attributes?: any[];
  order?: string[][];
  include?: {} | any[];
  limit?: any;
  offset?: number;
  where?: {};
  transaction?: Transaction;
  subQuery?: any;
  paranoid?: any;
  group?: any;
  distinct?: any;
  raw?: boolean;
}

export interface DBInterface extends ModelProps {
  Sequelize?: typeof Sequelize;
  sequelize: Sequelize;
  connectDB: () => void;
  createDBTransaction: () => Promise<Transaction>;
  [key: string]: any;
}
