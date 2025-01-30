import _env from "../constants/env.js";

const checkURLHostname = (req, res, next) => {
  if (req.hostname !== _env.app.HOST)
    return res.status(400).end(`Unsupported host: ${req.hostname}`);

  next();
};

const check = {
  hostname: checkURLHostname,
};

export default check;
