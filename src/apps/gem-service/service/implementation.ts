import { ReadRepository, WriteRepository } from "../repository";

export class ServiceImpl {
  private readRepo: ReadRepository;
  private writeRepo: WriteRepository;

  constructor(readRepo: ReadRepository, writeRepo: WriteRepository) {
    this.readRepo = readRepo;
    this.writeRepo = writeRepo;
  }

  public async viewGem(userId: string): Promise<number> {
    try {
      const gemAccount = await this.readRepo.getGemAccountByUserId(userId);
      return gemAccount.balance;
    } catch (error) {
      console.log("could not view gem because: ", error);
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
