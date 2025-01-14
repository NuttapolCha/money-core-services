import express, { Application } from "express";
import { newReadRepository, newWriteRepository } from "./repository";
import { config, logger } from "../../shared";
import bodyParser from "body-parser";
import { newService, Service } from "./service";
import { TransferGemRequest } from "./types";
import { Pagination } from "../../shared/view";

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
      res.send("gem-service healthy");
      return;
    });

    this.app.get("/balance", async (req, res) => {
      const userId = req.headers["user-id"] as string;
      if (!userId) {
        logger.error("unauthorized for GET /balance", {
          requestHeader: req.headers,
        });
        res.status(401).send({ messsage: "user-id is required in header" });
        return;
      }

      try {
        const account = await this.service.getGemAccount(userId);
        res.send({
          message: "success",
          data: account.toResponse(),
        });
        return;
      } catch (error) {
        logger.error("error occurred in GET /balance", {
          error,
          userId,
          requestHeader: req.headers,
        });
        res.status(500).send({ message: "something went wrong" });
        return;
      }
    });

    this.app.get("/transactions", async (req, res) => {
      const userId = req.headers["user-id"] as string;
      if (!userId) {
        logger.error("unauthorized for GET /transactions", {
          requestHeader: req.headers,
        });
        res.status(401).send({ messsage: "user-id is required in header" });
        return;
      }

      const pagination = Pagination.FromRequest(req);
      try {
        const transactions = await this.service.viewGemTransactions(
          userId,
          pagination
        );
        res.status(200).send({
          message: "success",
          data: transactions,
          pagination: pagination.toResponse(),
        });
      } catch (error) {
        logger.error("error occurred in GET /transactions", {
          error,
          userId,
          requestHeader: req.headers,
        });
        res.status(500).send({ message: "something went wrong" });
        return;
      }
    });

    this.app.post("/transfer-gem", async (req, res) => {
      const userId = req.headers["user-id"] as string;
      if (!userId) {
        logger.error("unauthorized for POST /transfer-gem", {
          requestHeader: req.headers,
        });
        res.status(401).send({ messsage: "user-id is required in header" });
        return;
      }

      const { toUserId, amount } = req.body as TransferGemRequest;
      if (amount <= 0) {
        logger.info(
          `user trying to transfer ${amount} gem which is not allowed`,
          {
            userId,
            requestHeader: req.headers,
          }
        );
        res
          .status(422)
          .send({ message: "transfer amount must be greater than 0" });
        return;
      }

      try {
        await this.service.transferGem(userId, toUserId, amount);
        res.status(200).send({ message: "success" });
        return;
      } catch (error) {
        logger.error("error occurred in POST /transfer-gem", {
          error,
          userId,
          requestHeader: req.headers,
        });
        res.status(500).send({ message: "something went wrong" });
        return;
      }
    });
  }

  public serveAPI() {
    this.app.listen(config.services.gem.port, () => {
      logger.info(`server started at localhost:${config.services.gem.port}`);
    });
  }
}
