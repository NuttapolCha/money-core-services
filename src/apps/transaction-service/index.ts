import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.TRANSACTION_SERVICE_PORT;

app.get("/", (req, res) => {
  res.send("This is Transaction Service");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
