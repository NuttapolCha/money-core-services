import { App } from "./app";
import { newWriteRepository } from "./repository";

const main = () => {
  const app = new App();
  app.serveAPI();
};

main();
