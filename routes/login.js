import { Router } from "express";
import User from "../models/User.js";
import c from "../utils/status_codes.js";
import _user from "../utils/user.js";
import _password from "../utils/password.js";
import auth from "../middlewares/auth.js";
import cookie from "../constants/cookies.js";

const router = Router();

// Login
router.post("/", async (req, res) => {
  const { username = null, password = null } = req.body;

  const userData = await User.findOne({
    where: { username },
    attributes: ["blocked", "password"],
  });

  if (userData === null)
    return res.status(c.BAD_REQUEST).json("No user with that username");

  if (userData.blocked)
    return res
      .status(c.FORBIDDEN)
      .json({ message: "User is blocked by admin" });

  if (!_password.comparePassword(password, userData.password))
    return res.status(c.UNAUTHORIZED).json({ message: "Wrong password" });

  const _userData = await _user.getUserDataByUsername(username);

  const sessionId = await auth.setup(_userData);

  res.cookie(cookie.sessionId, sessionId, {
    sameSite: "strict",
    httpOnly: true,
    secure: true,
  });

  res.status(c.OK).json({ message: "User logged in successfully" });
});

// Signup
router.post("/new", async (req, res) => {
  const { username = null, password = null } = req.body;

  if (username === null || password === null)
    return res
      .status(c.BAD_REQUEST)
      .json({ message: "Required credentials missing" });

  if (!(await _user.isUsernameAvailable(username)))
    return res.status(c.CONFLICT).json({ message: "Username already taken" });

  if (!_password.checkPassword(password))
    return res
      .status(c.BAD_REQUEST)
      .json({ message: "Password doesn't adhere rules" });

  const userSave = await User.create({ username, password });

  const sessionId = await auth.setup(userSave);

  res.cookie(cookie.sessionId, sessionId, {
    sameSite: "strict",
    httpOnly: true,
    secure: true,
  });

  res.status(c.CREATED).json({ message: "User created" });
});

export const LoginRouter = router;
