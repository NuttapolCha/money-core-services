import { GemAccount, User } from "../../../shared";
import { Pagination, UserTransaction } from "../../../shared/view";
import { ReadRepository, WriteRepository } from "../repository";
import { ServiceImpl } from "./implementation";

export interface Service {
  getGemAccount(userId: string): Promise<GemAccount>;
  viewGemTransactions(
    userId: string,
    pagination: Pagination
  ): Promise<UserTransaction[]>;
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
