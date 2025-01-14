import express, { Application } from "express";
import { newReadRepository, newWriteRepository } from "./repository";
import { config, logger } from "../../shared";
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
      res.send("user-service healthy");
      return;
    });

    this.app.get("/me", async (req, res) => {
      const userId = req.headers["user-id"] as string;
      if (!userId) {
        logger.error("unauthorized for GET /me", {
          requestHeader: req.headers,
        });
        res.status(401).send({ messsage: "user-id is required in header" });
        return;
      }

      try {
        const user = await this.service.getUser(userId);
        res.status(200).send({ message: "success", data: user.toResponse() });
        return;
      } catch (error) {
        logger.error("error occurred in GET /me", {
          error,
          userId,
          requestHeader: req.headers,
        });
        res.status(500).send({ message: "something went wrong" });
        return;
      }
    });

    this.app.post("/users", async (req, res) => {
      const { username } = req.body as CreateUserRequest;
      try {
        const user = await this.service.createNewUser(username);
        res
          .status(201)
          .send({ message: "user has been created", data: user.toResponse() });
        return;
      } catch (error) {
        logger.error("error occurred in POST /users", {
          error,
          requestHeader: req.headers,
        });
        res.status(500).send({ message: "something went wrong" });
        return;
      }
    });
  }

  public serveAPI() {
    this.app.listen(config.services.user.port, () => {
      logger.info(`server started at localhost:${config.services.user.port}`);
    });
  }
}
