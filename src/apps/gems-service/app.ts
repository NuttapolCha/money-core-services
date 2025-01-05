import express, { Application } from "express";
import { newReadRepository, newWriteRepository } from "./repository";
import { config } from "../../shared";
import bodyParser from "body-parser";
import { newService, Service } from "./service";
import { CreateUserRequest } from "./types";

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

    this.app.post("/balance", async (req, res) => {
      const userId = req.headers["user-id"] as string;
      if (!userId) {
        res.status(401).send({ messsage: "user-id is required in header" });
      }

      const gems = await this.service.viewGems(userId);
      res.send({ message: "success", data: { gems } });
    });
  }

  public serveAPI() {
    this.app.listen(config.services.user.port, () => {
      console.log(`server started at localhost:${config.services.user.port}`);
    });
  }
}
