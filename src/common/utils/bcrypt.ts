import bcrypt from "bcrypt";

export const hashValue = async (value: string, saltsround: number = 10) =>
  await bcrypt.hash(value, saltsround);

export const compareValue = async (value: string, hashedValue: string) =>
  await bcrypt.compare(value, hashedValue);
