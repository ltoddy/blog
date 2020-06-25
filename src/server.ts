import app from "./app";
import { initialize } from "./init";

const server = app.listen(app.get("port"), async () => {
    await initialize();
    console.log(`  App is running at http://localhost:${app.get("port")} in ${app.get("env")} mode`);
    console.log("  Press CTRL-C to stop\n");
  }
);

export default server;
