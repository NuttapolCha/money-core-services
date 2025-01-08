import express, { Application } from "express";
import { newReadRepository, newWriteRepository } from "./repository";
import { config } from "../../shared";
import bodyParser from "body-parser";
import { newService, Service } from "./service";
import { TransferGemsRequest } from "./types";

export class App {
  private app: Application;
  private service: Service;

  constructor() {
    const app = express();

    const readRepo = newReadRepository();
    const writeRepo = newWriteRepository();
    const service = newService(readRepo, writeRepo);

    this.app = app;
    this.service = service;
    this.setupMiddlewares();
    this.setupRoutes();
  }

  private setupMiddlewares() {
    this.app.use(bodyParser.json());
  }

  private setupRoutes() {
    this.app.get("/healthz", (req, res) => {
      res.send("gems service healthy");
    });

    this.app.get("/balance", async (req, res) => {
      const userId = req.headers["user-id"] as string;
      if (!userId) {
        res.status(401).send({ messsage: "user-id is required in header" });
      }

      try {
        const gems = await this.service.viewGems(userId);
        res.send({ message: "success", data: { gems } });
      } catch (error) {
        res.status(500).send({ message: "something went wrong" });
      }
    });

    this.app.post("/transfer-gems", async (req, res) => {
      const userId = req.headers["user-id"] as string;
      if (!userId) {
        res.status(401).send({ messsage: "user-id is required in header" });
      }

      const { toUserId, amount } = req.body as TransferGemsRequest;
      if (amount <= 0) {
        res
          .status(442)
          .send({ message: "transfer amount must be greater than 0" });
      }

      try {
        await this.service.transferGems(userId, toUserId, amount);
      } catch (error) {
        res.status(500).send({ message: "something went wrong" });
      }
    });
  }

  public serveAPI() {
    this.app.listen(config.services.gems.port, () => {
      console.log(`server started at localhost:${config.services.gems.port}`);
    });
  }
}
