import { App } from "./app";
import { newWriteRepository } from "./repository";

const main = () => {
  const writeRepo = newWriteRepository();
  const app = new App(writeRepo);
  app.serveAPI();
};

main();
