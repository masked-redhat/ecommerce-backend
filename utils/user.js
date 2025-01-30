import _env from "../constants/env.js";
import User from "../models/User.js";

const getUserDataByUsername = async (username) => {
  const userData = await User.findOne({
    where: { username },
    attributes: ["id", "username", "blocked", "isSeller"],
  });

  return userData;
};

const isUserBlocked = async (userId) => {
  const userData = await User.findOne({
    where: { id: userId },
    attributes: ["blocked"],
  });

  return userData.blocked === true;
};

const _user = {
  getUserDataByUsername,
  isUserBlocked,
};

export default _user;
