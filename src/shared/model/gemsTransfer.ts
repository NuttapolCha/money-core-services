import { v4 } from "uuid";
import { TransactionType } from "./transactionType";

export class GemsTransfer {
  transactionId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  type: TransactionType;
  description: string;
  createdAt: Date;

  constructor(fromUserId: string, toUserId: string, amount: number) {
    this.transactionId = v4();
    this.fromUserId = fromUserId;
    this.toUserId = toUserId;
    if (amount <= 0) {
      throw "transfer amount must be greater than 0";
    }
    this.amount = amount;
    this.type = TransactionType.Transfer;
    this.description = `transfer gems from ${fromUserId} to ${toUserId}`;
    this.createdAt = new Date();
  }
}
