import path from "path";

import express, { Application } from "express";

import { PORT } from "./config";
import homeController from "./controllers/home";

const app: Application = express();

app.set("port", PORT);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

app.use("/", homeController);

export default app;
