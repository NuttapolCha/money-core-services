import express, { Application } from "express";
import { newReadRepository, newWriteRepository } from "./repository";
import { config } from "../../shared";
import bodyParser from "body-parser";
import { newService, Service } from "./service";

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
      res.send("balance service healthy");
    });

    this.app.post("/users", async (req, res) => {
      const { name } = req.body;
      try {
        await this.service.createNewUser(name);
        res.status(201).send("user created");
      } catch (error) {
        res.status(500).send("something went wrong");
      }
    });
  }

  public serveAPI() {
    this.app.listen(config.services.balance.port, () => {
      console.log(
        `server started at localhost:${config.services.balance.port}`
      );
    });
  }
}
