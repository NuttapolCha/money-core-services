import { ReadRepository, WriteRepository } from "../repository";

export class ServiceImpl {
  private readRepo: ReadRepository;
  private writeRepo: WriteRepository;

  constructor(readRepo: ReadRepository, writeRepo: WriteRepository) {
    this.readRepo = readRepo;
    this.writeRepo = writeRepo;
  }

  public async viewGems(userId: string): Promise<number> {
    try {
      const gems = await this.readRepo.getGemsByUserId(userId);
      return gems.balance;
    } catch (error) {
      console.log("could not view gems because: ", error);
      throw error;
    }
  }
}