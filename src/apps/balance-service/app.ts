import express, { Application } from "express";
import { WriteRepository } from "./repository";
import { config } from "../../shared";
import bodyParser from "body-parser";

export class App {
  private app: Application;
  private writeRepo: WriteRepository;

  constructor(writeRepo: WriteRepository) {
    this.app = express();
    this.writeRepo = writeRepo;
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

    this.app.post("/users", (req, res) => {
      console.log("req.body=", req.body);
      res.send(req.body);
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
