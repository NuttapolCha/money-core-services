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

  public async getUser(id: string): Promise<User> {
    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");
      const { rows } = await client.query<GetUserQueryResult>(GET_USER, [id]);

      // result rows should have length of 1
      return new User(rows[0].name, {
        id: rows[0].id,
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
