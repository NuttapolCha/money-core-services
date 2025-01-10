import dotenv from "dotenv";

dotenv.config();

export const config = {
  services: {
    user: {
      port: parseInt(process.env.USER_SERVICE_PORT || "3010", 10),
    },
    gem: {
      port: parseInt(process.env.GEM_SERVICE_PORT || "3020", 10),
    },
    transfer: {
      port: parseInt(process.env.TRANSFER_SERVICE_PORT || "3030", 10),
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
