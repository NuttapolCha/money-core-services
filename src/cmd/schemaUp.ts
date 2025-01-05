import { Client } from "pg";
import * as fs from "fs";
import { config, constant } from "../shared";
import path from "path";

const { migrationsDir } = constant;

const CREATE_TABLE_SCHEMA_MIGRATIONS = `
 CREATE TABLE IF NOT EXISTS schema_migrations (
    file_name VARCHAR(255),
    applied_at TIMESTAMP DEFAULT NOW()
 )
`;

const SELECT_FILE_NAME = `
  SELECT file_name FROM schema_migrations
`;

const INSERT_FILE_NAME = `
  INSERT INTO schema_migrations (file_name) VALUES ($1)
`;

type SchemaMigration = {
  file_name: string;
  applied_at: Date;
};

const up = async () => {
  const { host, port, database, user, password } = config.db.writer;
  const client = new Client({
    host,
    port,
    database,
    user,
    password,
  });

  try {
    await client.connect();
    await client.query("BEGIN");
    await client.query(CREATE_TABLE_SCHEMA_MIGRATIONS);

    const { rows } = await client.query<SchemaMigration>(SELECT_FILE_NAME);

    const appliedMigrations = new Set();
    for (const row of rows) {
      appliedMigrations.add(row.file_name);
    }

    const fileNames = fs.readdirSync(migrationsDir).sort();
    for (const fileName of fileNames) {
      const skipThisFile =
        !fileName.endsWith(".up.sql") || appliedMigrations.has(fileName);
      if (skipThisFile) {
        continue;
      }

      const filePath = path.join(migrationsDir, fileName);
      const stmt = fs.readFileSync(filePath, "utf8");

      await client.query(stmt);
      await client.query(INSERT_FILE_NAME, [fileName]);
      console.log(`Successfully applied migration ${fileName}`);
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
};

up()
  .then((e) => {
    console.log("done");
    process.exit(0);
  })
  .catch((error) => {
    console.log("error :", error);
    process.exit(1);
  });
