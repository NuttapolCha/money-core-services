import { Pool } from "pg";
import { config, GemAccount } from "../../../shared";
import { ReadRepositoryImpl, WriteRepositoryImpl } from "./implementation";

export interface WriteRepository {
  createGemTransferTransaction(
    fromUserId: string,
    toUserId: string,
    amount: number
  ): Promise<void>;
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
  getGemAccountByUserId(userId: string): Promise<GemAccount>;
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