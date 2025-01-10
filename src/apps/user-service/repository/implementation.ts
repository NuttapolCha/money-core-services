import { Pool } from "pg";
import { User } from "../../../shared";
import { CREATE_GEM_ACCOUNT_QUERY, CREATE_USER_QUERY } from "./query";

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
}
