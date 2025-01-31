import express from "express";
import helmet from "helmet";
import _env from "./constants/env.js"; // env variables
import cookieParser from "cookie-parser";
import _connect from "./db/connect.js"; // db functions
import _close from "./db/close.js"; // db functions
import r from "./routes/router.js"; // routes
import check from "./middlewares/url.js";
import auth from "./middlewares/auth.js";

const app = express();
const port = _env.app.PORT;

// middlewares
app.use(express.json()); // for json data
app.use(cookieParser()); // application can use cookies
app.use(helmet()); // security measures
app.use(check.hostname); // check url from the host

app.use("/login", r.login); // login first, no auth needed for this endpoint

app.use(auth.verify); // authentication middleware

// public folder
app.use(express.static(_env.app.PUBLIC));

// reduce fingerprinting
app.disable("x-powered-by");

// Connect to databases
await _connect.nosql();
await _connect.sql();

app.get("/test", (req, res) => {
  res.send(req.user);
});

app.use("/seller", r.seller); // seller
app.use("/logout", r.logout); // logout

const server = app.listen(port, () => {
  console.log(`Application started on http://${_env.app.HOST}:${port}`);
});

// gracefull shutdown of application
{
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
}
