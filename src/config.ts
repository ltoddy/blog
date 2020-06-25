import { resolve } from "path";

export const PORT = Number.parseInt(process.env.PORT || "3000");

export const SECRET = process.env.SECRET || "guess a string";

// docker run -d --name=blog-mongo -p 27017:27017 mongo:latest
// mongo volume: /my/own/datadir:/data/db
export const MONGO_HOST = process.env.MONGO_HOST || "localhost";
export const MONGO_PORT = process.env.MONGO_PORT || "27017";
export const MONGO_DATABASE = process.env.MONGO_DATABASE || "blog";
export const MONGODB_URI = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`;

export const POSTS_PER_PAGE = Number.parseInt(process.env.POSTS_PER_PAGE || "8");

export const ABOUT_ME_PATH = resolve(__dirname, "..", "about-me.md");

export const ADMIN_EMAIL = "taoliu0509@gmail.com";
export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "helloworld";
