import { User } from "../../../shared";
import { ReadRepository, WriteRepository } from "../repository";

export class ServiceImpl {
  private readRepo: ReadRepository;
  private writeRepo: WriteRepository;

  constructor(readRepo: ReadRepository, writeRepo: WriteRepository) {
    this.readRepo = readRepo;
    this.writeRepo = writeRepo;
  }

  public async createNewUser(name: string): Promise<User> {
    const user = new User(name);
    try {
      await this.writeRepo.createUser(user);
    } catch (error) {
      console.log("could not create new user because: ", error);
      throw error;
    }
    return user;
  }

  public async getUser(id: string): Promise<User> {
    try {
      const user = await this.readRepo.getUser(id);
      return user;
    } catch (error) {
      console.log("could not get user because: ", error);
      throw error;
    }
  }
}
