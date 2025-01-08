import { Pool } from "pg";
import { GemAccounts, GemsTransfer, User } from "../../../shared";
import { GET_GEMS_BY_USER_ID_QUERY, GetGemsQueryResult } from "./query";

export class WriteRepositoryImpl {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  public async createGemsTransferTransaction(
    gemsTransfer: GemsTransfer
  ): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      // TODO
      await client.query("COMMIT");
    } catch (error) {
      throw error;
    } finally {
      await client.query("ROLLBACK");
      client.release();
    }
  }
}

export class ReadRepositoryImpl {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  public async getGemsByUserId(userId: string): Promise<GemAccounts> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const { rows } = await client.query<GetGemsQueryResult>(
        GET_GEMS_BY_USER_ID_QUERY,
        [userId]
      );

      // result rows should have length of 1
      return new GemAccounts(userId, {
        id: rows[0].id,
        balance: rows[0].balance,
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
}
