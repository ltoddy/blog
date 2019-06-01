export const PORT = Number.parseInt(process.env.PORT || "3000");

// docker run -d --name=blog-mongo -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=hello mongo:latest
// mongo volume: /my/own/datadir:/data/db
export const MONGO_HOST = process.env.MONGO_HOST || "localhost";
export const MONGO_PORT = process.env.MONGO_PORT || "27017";
export const MONGO_USER = process.env.MONGO_USER || "admin";
export const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "hello";
export const MONGODB_URI = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`;
