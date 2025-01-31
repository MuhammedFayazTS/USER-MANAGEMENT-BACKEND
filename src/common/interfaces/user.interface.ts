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
  }

  export interface GoogleLoginUser {
    firstName: string;
    lastName: string;
    image: string;
    email: string;
    externalUserId: string;
    isEmailVerified: boolean;
    origin: "google";
  }
  