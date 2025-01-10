import dotenv from "dotenv";

dotenv.config();

export const config = {
  appName: process.env.APP_NAME || "unknown-app-name",
  nodeEnv: process.env.NODE_ENV || "production",
  services: {
    user: {
      port: parseInt(process.env.USER_SERVICE_PORT || "3010", 10),
    },
    gem: {
      port: parseInt(process.env.GEM_SERVICE_PORT || "3020", 10),
    },
  },
  db: {
    writer: {
      host: process.env.WRITER_DB_HOST || "localhost",
      port: parseInt(process.env.WRITER_DB_PORT || "6543", 10),
      database: process.env.WRITER_DB_NAME || "money_core",
      user: process.env.WRITER_DB_USER || "money",
      password: process.env.WRITER_DB_PASSWORD || "money",
    },
    reader: {
      host: process.env.WRITER_DB_HOST || "localhost",
      port: parseInt(process.env.WRITER_DB_PORT || "6543", 10),
      database: process.env.WRITER_DB_NAME || "money_core",
      user: process.env.WRITER_DB_USER || "money",
      password: process.env.WRITER_DB_PASSWORD || "money",
    },
  },
};
