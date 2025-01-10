import { Pool, PoolClient } from "pg";
import { GemAccount, GemTransaction, User } from "../../../shared";
import {
  CREATE_GEM_TRANSACTION_QUERY,
  GET_GEM_ACCOUNT_BY_USER_ID_QUERY,
  GetGemAccountQueryResult,
  SELECT_GEM_ACCOUNTS_FOR_UPDATE_QUERY,
  UPDATE_GEM_ACCOUNT_QUERY,
} from "./query";
import {
  CREATE_GEM_LEDGER_ENTIRES_QUERY,
  GET_ENTRIES_BY_USER_ID_QUERY,
  GetEntriesByUserIdQueryResult,
} from "./query/gemLedgerEntries";
import { Pagination, UserTransaction } from "../../../shared/view";

export class WriteRepositoryImpl {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  public async createGemTransferTransaction(
    fromUserId: string,
    toUserId: string,
    amount: number
  ): Promise<void> {
    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");

      const { senderAccount, recieverAccount } =
        await this.getSenderAndReciverAccountForUpdate(
          client,
          fromUserId,
          toUserId
        );

      const transaction = GemTransaction.NewTransferTransaction(
        senderAccount,
        recieverAccount,
        amount
      );

      await client.query(
        CREATE_GEM_TRANSACTION_QUERY,
        transaction.toSqlValue()
      );
      await client.query(CREATE_GEM_LEDGER_ENTIRES_QUERY, [
        ...transaction.entry1SqlValue(),
        ...transaction.entry2SqlValue(),
      ]);
      await client.query(UPDATE_GEM_ACCOUNT_QUERY, senderAccount.toSqlValue());
      await client.query(
        UPDATE_GEM_ACCOUNT_QUERY,
        recieverAccount.toSqlValue()
      );

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  private async getSenderAndReciverAccountForUpdate(
    client: PoolClient,
    fromUserId: string,
    toUserId: string
  ): Promise<{
    senderAccount: GemAccount;
    recieverAccount: GemAccount;
  }> {
    let senderAccount: GemAccount | null = null;
    let recieverAccount: GemAccount | null = null;

    const { rows } = await client.query<GetGemAccountQueryResult>(
      SELECT_GEM_ACCOUNTS_FOR_UPDATE_QUERY,
      [fromUserId, toUserId]
    );
    for (const row of rows) {
      if (row.user_id === fromUserId) {
        senderAccount = new GemAccount(row.user_id, {
          id: row.id,
          balance: Number(row.balance),
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        });
      }
      if (row.user_id === toUserId) {
        recieverAccount = new GemAccount(row.user_id, {
          id: row.id,
          balance: Number(row.balance),
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        });
      }
    }
    if (!senderAccount) {
      throw "sender account not found";
    }
    if (!recieverAccount) {
      throw "reciever account not found";
    }

    return { senderAccount, recieverAccount };
  }
}

export class ReadRepositoryImpl {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  public async getGemAccountByUserId(userId: string): Promise<GemAccount> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const { rows } = await client.query<GetGemAccountQueryResult>(
        GET_GEM_ACCOUNT_BY_USER_ID_QUERY,
        [userId]
      );

      // result rows should have length of 1
      return new GemAccount(userId, {
        id: rows[0].id,
        balance: Number(rows[0].balance),
        createdAt: rows[0].created_at,
        updatedAt: rows[0].updated_at,
      });

      // no need to commit read only transaction
    } catch (error) {
      throw error;
    } finally {
      await client.query("ROLLBACK");
      client.release();
    }
  }

  public async viewGemTransactions(
    userId: string,
    pagination: Pagination
  ): Promise<UserTransaction[]> {
    const userTransactions: UserTransaction[] = [];
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const { rows } = await client.query<GetEntriesByUserIdQueryResult>(
        GET_ENTRIES_BY_USER_ID_QUERY,
        [userId, pagination.getLimit(), pagination.getOffset()]
      );
      for (const row of rows) {
        userTransactions.push({
          transactionId: row.gem_transaction_id,
          amount: Number(row.amount),
          timestamp: row.created_at,
        });
        pagination.setTotal(Number(row.total));
      }

      // no need to commit read only transaction
    } catch (error) {
      throw error;
    } finally {
      await client.query("ROLLBACK");
      client.release();
    }
    return userTransactions;
  }
}
