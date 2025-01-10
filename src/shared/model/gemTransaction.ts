import { v4 } from "uuid";
import { GemLedgerEntry } from "./gemLedgerEntry";
import { TransactionType } from "./transactionType";
import { GemAccount } from "./gemAccount";

export class GemTransaction {
  id: string;
  entry1: GemLedgerEntry;
  entry2: GemLedgerEntry;
  type: TransactionType;
  description: string;
  createdAt: Date;

  private constructor(
    entry1: GemLedgerEntry,
    entry2: GemLedgerEntry,
    type: TransactionType,
    description: string,
    createdAt: Date
  ) {
    this.id = v4();
    this.entry1 = entry1;
    this.entry2 = entry2;
    this.type = type;
    this.description = description;
    this.createdAt = createdAt;
  }

  public static NewTransferTransaction(
    senderAccount: GemAccount,
    recieverAccount: GemAccount,
    amount: number
  ): GemTransaction {
    if (!senderAccount.hasSufficientBalance(amount)) {
      throw "sender has insufficient balance";
    }
    if (amount <= 0) {
      throw "transfer amount must be greater than 0";
    }
    senderAccount.deductBalance(amount);
    recieverAccount.addBalance(amount);

    const now = new Date();
    const senderEntry = new GemLedgerEntry(senderAccount, amount * -1, now);
    const recieverEntry = new GemLedgerEntry(recieverAccount, amount, now);

    return new GemTransaction(
      senderEntry,
      recieverEntry,
      TransactionType.Transfer,
      `transfer from account ${senderAccount.id} to account ${recieverAccount.id}`,
      now
    );
  }

  public toSqlValue() {
    return [this.id, this.type, this.description, this.createdAt];
  }

  public entry1SqlValue() {
    return [
      this.entry1.id,
      this.id,
      this.entry1.account.id,
      this.entry1.amount,
      this.entry1.createdAt,
    ];
  }

  public entry2SqlValue() {
    return [
      this.entry2.id,
      this.id,
      this.entry2.account.id,
      this.entry2.amount,
      this.entry2.createdAt,
    ];
  }
}
