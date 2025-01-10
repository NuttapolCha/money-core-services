import { Pool } from "pg";
import { GemAccount, User } from "../../../shared";
import {
  CREATE_GEM_ACCOUNT_QUERY,
  CREATE_USER_QUERY,
  GET_USER_QUERY,
  GetUserQueryResult,
} from "./query";

export class WriteRepositoryImpl {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  public async createUser(user: User): Promise<void> {
    const client = await this.pool.connect();
    const userValues = user.toSqlValue();
    const gemAccountValues = user.gemAccount.toSqlValue();

    try {
      await client.query("BEGIN");
      await client.query(CREATE_USER_QUERY, userValues);
      await client.query(CREATE_GEM_ACCOUNT_QUERY, gemAccountValues);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

export class ReadRepositoryImpl {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  public async getUser(id: string): Promise<User> {
    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");
      const { rows } = await client.query<GetUserQueryResult>(GET_USER_QUERY, [
        id,
      ]);
      const user = new User(rows[0].username, {
        id: rows[0].id,
        gemAccount: new GemAccount(rows[0].id, {
          id: rows[0].account_id,
          balance: Number(rows[0].balance),
          createdAt: rows[0].gem_account_created_at,
          updatedAt: rows[0].gem_account_updated_at,
        }),
        createdAt: rows[0].created_at,
        updatedAt: rows[0].updated_at,
      });
      return user;
    } catch (error) {
      throw error;
    } finally {
      await client.query("ROLLBACK");
      client.release();
    }
  }
}
