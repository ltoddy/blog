import app from "./app";
import loggerFactory from "./utils/logger";

const logger = loggerFactory("server.ts");

const server = app.listen(app.get("port"), () => {
    logger.info(`  App is running at http://localhost:${app.get("port")} in ${app.get("env")} mode`);
    console.log("  Press CTRL-C to stop\n");
  }
);

export default server;
