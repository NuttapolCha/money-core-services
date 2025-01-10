import { Pool } from "pg";
import { User } from "../../../shared";
import { CREATE_GEMS_QUERY, CREATE_USER_QUERY } from "./query";

export class WriteRepositoryImpl {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  public async createUser(user: User): Promise<void> {
    const client = await this.pool.connect();
    const userValues = user.toSqlValue();
    const gemsValues = user.gemsAccount.toSqlValue();

    try {
      await client.query("BEGIN");
      await client.query(CREATE_USER_QUERY, userValues);
      await client.query(CREATE_GEMS_QUERY, gemsValues);
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
