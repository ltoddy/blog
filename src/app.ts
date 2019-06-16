import path from "path";

import express, { NextFunction, Request, Response } from "express";
import compression from "compression"; // compresses requests
import mongoose from "mongoose";
import bodyParser from "body-parser";
import session from "express-session";
import formidable from "express-formidable";
import flash from "express-flash";
import mongo from "connect-mongo";

import { MONGODB_URI, PORT, SECRET } from "./config";
import homeRouter from "./router/home";
import authRouter from "./router/auth";
import postsRouter from "./router/posts";
import commentsRouter from "./router/comments";
import apiRouter from "./router/api";
import pageNotFound from "./errors/404";
import loggerFactory from "./utils/logger";

const logger = loggerFactory("app.ts");
const app = express();
const MongoStore = mongo(session);

mongoose.connect(MONGODB_URI, {
  poolSize: 25,
})
  .then(() => console.log("ready connect mongodb."))
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
app.use(flash());
app.use(formidable());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: SECRET,
  store: new MongoStore({
    url: MONGODB_URI,
    autoReconnect: true,
  }),
}));
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.user = req.session.user;
  next();
});

app.use(express.static(path.join(__dirname, "../public"), { maxAge: 31557600000 }));

// Controllers (route handlers)
app.use("/", homeRouter);
app.use("/auth", authRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
app.use("/api", apiRouter);

app.use(pageNotFound);

export default app;
