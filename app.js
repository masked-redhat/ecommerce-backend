import express from "express";
import helmet from "helmet";
import _env from "./constants/env.js"; // env variables
import cookieParser from "cookie-parser";
import _connect from "./db/connect.js";
import r from "./routes/router.js";
import _close from "./db/close.js";
import check from "./middlewares/url.js";

const app = express();
const port = _env.app.PORT;

// middlewares
app.use(cookieParser()); // application can use cookies
app.use(helmet()); // security measures
app.use(check.hostname); // check url from the host

// public folder
app.use(express.static(_env.app.PUBLIC));

// disabling x-powered-by
app.disable("x-powered-by");

// Connect to databases
await _connect.nosql();
await _connect.sql();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const server = app.listen(port, () => {
  console.log(`Application started on http://${_env.app.HOST}:${port}`);
});

const shutDown = async () => {
  // Close running services here
  server.close();
  await _close.nosql();
  await _close.sql();

  console.debug("Gracefully closing the application");
};

process.on("SIGINT", async () => {
  console.debug("Recieved SIGINT");
  await shutDown();
});

process.on("SIGTERM", async () => {
  console.debug("Recieved SIGTERM/(nodemon restarts)");
  await shutDown();
});

process.on("uncaughtException", async () => {
  console.debug("Recieved Uncaught Exception");
  await shutDown();
});

process.on("uncaughtExceptionMonitor", async () => {
  console.debug("Recieved Uncaught Exception Monitor");
  await shutDown();
});

process.on("unhandledRejection", async () => {
  console.debug("Recieved unhandled Rejection");
  await shutDown();
});
