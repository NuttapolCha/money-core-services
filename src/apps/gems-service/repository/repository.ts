import { Pool } from "pg";
import { config, Gems, User } from "../../../shared";
import { ReadRepositoryImpl, WriteRepositoryImpl } from "./implementation";

export interface WriteRepository {}

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
  getGemsByUserId(userId: string): Promise<Gems>;
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