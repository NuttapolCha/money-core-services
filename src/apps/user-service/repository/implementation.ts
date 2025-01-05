import { Pool } from "pg";
import { User } from "../../../shared";
import { CREATE_USER_QUERY, GET_USER, GetUserQueryResult } from "./query";

export class WriteRepositoryImpl {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  public async createUser(user: User): Promise<void> {
    const client = await this.pool.connect();
    const values = user.toSqlValue();

    try {
      await client.query("BEGIN");
      await client.query(CREATE_USER_QUERY, values);
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
