import express from "express";
import _env from "./constants/env.js"; // env variables
import cookieParser from "cookie-parser";
import _connect from "./db/connect.js";
import r from "./routes/router.js";
import _close from "./db/close.js";

const app = express();
const port = _env.app.PORT;

// application can use cookies
app.use(cookieParser());

// public folder
app.use(express.static(_env.app.PUBLIC));

// Connect to databases
_connect.mongo();
_connect.pg();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// use of _routes
// app.use("/custom_route", r.customRouter)

const server = app.listen(port, () => {
  console.log(`Application started on http://${_env.app.HOST}:${port}`);
});

const shutDown = () => {
  // Close running services here
  server.close();
  _close.mongo();
  _close.pg();

  console.debug("Gracefully closing the application");
};

process.on("SIGINT", () => {
  console.debug("Recieved SIGINT");
  shutDown();
});

process.on("SIGTERM", () => {
  console.debug("Recieved SIGTERM/(nodemon restarts)");
  shutDown();
});
