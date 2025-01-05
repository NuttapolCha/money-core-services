import { Pool } from "pg";
import { config, User } from "../../../shared";
import { writeRepositoryImpl } from "./implementation";

export interface WriteRepository {
  createUser(user: User): Promise<void>;
}

export interface ReadRepository {
  getUser(userId: string): Promise<User>;
}

export const newWriteRepository = (): WriteRepository => {
  const { host, port, database, user, password } = config.db.writer;
  const pool = new Pool({
    host,
    port,
    database,
    user,
    password,
  });
  return new writeRepositoryImpl(pool);
};
