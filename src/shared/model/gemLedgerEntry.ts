import { v4 } from "uuid";
import { GemAccount } from "./gems";

export class GemLedgerEntry {
  id: string;
  account: GemAccount;
  amount: number;
  createdAt: Date;

  constructor(gemAccount: GemAccount, amount: number, createdAt: Date) {
    this.id = v4();
    this.account = gemAccount;
    this.amount = amount;
    this.createdAt = createdAt;
  }
}
