import { GroupAttributes } from "../../database/models/group.model";

export interface NewUser {
    firstName: string;
    lastName?: string;
    image?: string;
    email: string;
    password?: string | null;
    roleId:number;
    externalUserId?:string
    isEmailVerified?:boolean
    origin?: string;
    groups?:GroupAttributes[]
  }

  export interface GoogleLoginUser {
    firstName: string;
    lastName: string;
    image: string;
    email: string;
    externalUserId: string;
    isEmailVerified: boolean;
    origin: "google";
    groups?:GroupAttributes[]
  }
  