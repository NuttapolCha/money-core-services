import * as fs from "fs";
import path from "path";
import { constant } from "../shared";

const { migrationsDir } = constant;

const generate = async () => {
  // Create the migrations directory if it doesn't exist
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir);
  }

  // Generate a timestamp
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");

  // Define the filenames
  const upFilename = `${timestamp}_TODO.up.sql`;

  // Define the full paths to the migration files
  const upFilePath = path.join(migrationsDir, upFilename);

  // Create the boilerplate content for the up migration
  const upContent = `-- Migration Script: ${upFilename}\n-- Created on ${new Date().toISOString()}\n\n-- Add your SQL commands here for the up migration\n\n-- Example:\n-- CREATE TABLE example (\n--     id INT PRIMARY KEY AUTO_INCREMENT,\n--     name VARCHAR(255) NOT NULL,\n--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n-- );\n`;

  // Write the up migration file
  fs.writeFileSync(upFilePath, upContent);
  console.log(`Migration file created: ${upFilePath}`);
};

generate()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
