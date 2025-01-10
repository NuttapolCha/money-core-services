import { Pool } from "pg";
import { config, User } from "../../../shared";
import { ReadRepositoryImpl, WriteRepositoryImpl } from "./implementation";

export interface WriteRepository {
  createUser(user: User): Promise<void>;
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
  return new WriteRepositoryImpl(pool);
};

export interface ReadRepository {
  getUser(id: string): Promise<User>;
}

export const newReadRepository = (): ReadRepository => {
  const { host, port, database, user, password } = config.db.writer;
  const pool = new Pool({
    host,
    port,
    database,
    user,
    password,
  });
  return new ReadRepositoryImpl(pool);
};
