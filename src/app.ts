import path from "path";

import express, { Application } from "express";
import mongoose from "mongoose";

import { MONGODB_URI, PORT } from "./config";
import homeController from "./controllers/home";
import loggerFactory from "./utils/logger";

const logger = loggerFactory("app.ts");
const app: Application = express();

mongoose.connect(MONGODB_URI)
  .then(() => logger.info(`ready connect mongodb.`))
  .catch(err => logger.error("MongoDB connection error. Please make sure MongoDB is running. " + err));

app.set("port", PORT);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../public"), { maxAge: 31557600000 }));

app.use("/", homeController);

export default app;
