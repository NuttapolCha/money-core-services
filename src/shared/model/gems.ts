import { v4 } from "uuid";

export type GemsConstructorOpts = {
  id?: string;
  balance?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export class GemAccounts {
  id: string;
  userId: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(userId: string, opts?: GemsConstructorOpts) {
    this.id = opts?.id ? opts.id : v4();
    this.userId = userId;
    this.balance = opts?.balance ? opts.balance : 0;
    this.createdAt = opts?.createdAt ? opts.createdAt : new Date();
    this.updatedAt = opts?.updatedAt ? opts.updatedAt : new Date();
  }

  public toSqlValue() {
    return [this.id, this.userId, this.balance, this.createdAt, this.updatedAt];
  }
}
