export const PORT = Number.parseInt(process.env.PORT || "3000");

export const SECRET = process.env.SECRET || "guess a string";

// docker run -d --name=blog-mongo -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=hello mongo:latest
// mongo volume: /my/own/datadir:/data/db
export const MONGO_HOST = process.env.MONGO_HOST || "localhost";
export const MONGO_PORT = process.env.MONGO_PORT || "27017";
export const MONGO_DATABASE = process.env.MONGO_DATABASE || "blog";
export const MONGODB_URI = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`;
