import { User } from "../../../shared";
import { ReadRepository, WriteRepository } from "../repository";
import { ServiceImpl } from "./implementation";

export interface Service {
  viewGem(userId: string): Promise<number>;
  transferGem(
    fromUserId: string,
    toUserId: string,
    amount: number
  ): Promise<void>;
}

export const newService = (
  readRepo: ReadRepository,
  writeRepo: WriteRepository
): Service => {
  return new ServiceImpl(readRepo, writeRepo);
};
