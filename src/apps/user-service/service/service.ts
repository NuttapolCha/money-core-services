import { User } from "../../../shared";
import { ReadRepository, WriteRepository } from "../repository";
import { ServiceImpl } from "./implementation";

export interface Service {
  createNewUser(name: string): Promise<User>;
}

export const newService = (
  readRepo: ReadRepository,
  writeRepo: WriteRepository
): Service => {
  return new ServiceImpl(readRepo, writeRepo);
};
