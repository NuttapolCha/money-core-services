import { GemAccount } from "../../../shared";
import { Pagination, UserTransaction } from "../../../shared/view";
import { ReadRepository, WriteRepository } from "../repository";

export class ServiceImpl {
  private readRepo: ReadRepository;
  private writeRepo: WriteRepository;

  constructor(readRepo: ReadRepository, writeRepo: WriteRepository) {
    this.readRepo = readRepo;
    this.writeRepo = writeRepo;
  }

  public async getGemAccount(userId: string): Promise<GemAccount> {
    try {
      const gemAccount = await this.readRepo.getGemAccountByUserId(userId);
      return gemAccount;
    } catch (error) {
      console.log("could not view gem because: ", error);
      throw error;
    }
  }

  public async viewGemTransactions(
    userId: string,
    pagination: Pagination
  ): Promise<UserTransaction[]> {
    try {
      const transactions = await this.readRepo.viewGemTransactions(
        userId,
        pagination
      );
      return transactions;
    } catch (error) {
      console.log("could not view gem transactions because: ", error);
      throw error;
    }
  }

  public async transferGem(
    fromUserId: string,
    toUserId: string,
    amount: number
  ): Promise<void> {
    try {
      await this.writeRepo.createGemTransferTransaction(
        fromUserId,
        toUserId,
        amount
      );
    } catch (error) {
      console.log("could not transfer gem because: ", error);
      throw error;
    }
  }
}
