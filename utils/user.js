import _env from "../constants/env.js";
import Cart from "../models/Cart.js";
import Customer from "../models/Customer.js";
import Seller from "../models/Seller.js";
import User from "../models/User.js";

const getUserDataByUsername = async (username) => {
  const user = await User.findOne({
    where: { username },
    attributes: ["id", "username", "blocked", "isSeller"],
    include: [
      {
        model: Customer,
        foreignKey: "userId",
        include: [
          {
            model: Cart,
            foreignKey: "customerId",
            as: "cart",
            attributes: { exclude: ["customerId", "createdAt"] },
          },
        ],
      },
      { model: Seller, foreignKey: "userId" },
    ],
  });

  const userData = {
    id: user.id,
    username: user.username,
    blocked: user.blocked,
    isSeller: user.isSeller,
    customer: user.Customer,
    seller: user.Seller,
  };

  return userData;
};

const isUserBlocked = async (userId) => {
  const userData = await User.findOne({
    where: { id: userId },
    attributes: ["blocked"],
  });

  return userData.blocked === true;
};

const isUsernameAvailable = async (username) => {
  const user = await User.findOne({ where: { username } });

  return user === null;
};

const _user = {
  getUserDataByUsername,
  isUserBlocked,
  isUsernameAvailable,
};

export default _user;
