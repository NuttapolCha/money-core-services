import { GemAccount, User } from "../../../shared";
import { ReadRepository, WriteRepository } from "../repository";
import { ServiceImpl } from "./implementation";

export interface Service {
  getGemAccount(userId: string): Promise<GemAccount>;
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
