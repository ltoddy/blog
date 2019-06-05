import path from "path";

import express from "express";
import compression from "compression"; // compresses requests
import mongoose from "mongoose";
import bodyParser from "body-parser";
import session from "express-session";
import mongo from "connect-mongo";

import { MONGODB_URI, PORT, SECRET } from "./config";
import homeController from "./controllers/home";
import authController from "./controllers/auth";
import apiController from "./controllers/api";
import loggerFactory from "./utils/logger";

const logger = loggerFactory("app.ts");
const app = express();
const MongoStore = mongo(session);

mongoose.connect(MONGODB_URI, {
  poolSize: 25,
})
  .then(() => logger.info("ready connect mongodb."))
  .catch(err => {
    logger.error("MongoDB connection error. Please make sure MongoDB is running. " + err);
    process.exit(1);
  });

app.set("port", PORT);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: SECRET,
  store: new MongoStore({
    url: MONGODB_URI,
    autoReconnect: true,
  }),
}));
app.use(express.static(path.join(__dirname, "../public"), { maxAge: 31557600000 }));

// Controllers (route handlers)
app.use("/", homeController);
app.use("/auth", authController);
app.use("/api", apiController);

export default app;
