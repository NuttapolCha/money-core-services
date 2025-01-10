import { v4 } from "uuid";

export type GemAccountConstructorOpts = {
  id?: string;
  balance?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export class GemAccount {
  id: string;
  userId: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(userId: string, opts?: GemAccountConstructorOpts) {
    this.id = opts?.id ? opts.id : v4();
    this.userId = userId;
    this.balance = opts?.balance || opts?.balance === 0 ? opts.balance : 1000;
    this.createdAt = opts?.createdAt ? opts.createdAt : new Date();
    this.updatedAt = opts?.updatedAt ? opts.updatedAt : new Date();
  }

  public deductBalance(amount: number) {
    this.balance -= amount;
    this.updatedAt = new Date();
  }

  public addBalance(amount: number) {
    this.balance += amount;
    this.updatedAt = new Date();
  }

  public hasSufficientBalance(amount: number): boolean {
    return this.balance >= 0 && this.balance >= amount;
  }

  public toSqlValue() {
    return [this.id, this.userId, this.balance, this.createdAt, this.updatedAt];
  }

  public toResponse() {
    return {
      gemAccountId: this.id,
      balance: this.balance,
    };
  }
}
