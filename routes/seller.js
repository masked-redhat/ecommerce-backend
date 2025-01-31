import { Router } from "express";
import Seller from "../models/Seller.js";
import Address from "../models/Address.js";
import c from "../utils/status_codes.js";
import User from "../models/User.js";
import _password from "../utils/password.js";
import { db } from "../db/connect.js";
import auth from "../middlewares/auth.js";
import handle from "../utils/handle.js";
import Product from "../models/products/Product.js";
import Variant from "../models/products/Variant.js";
import attr from "../constants/db.js";

const SELLER_LIMIT = attr.product.seller.limit;

const router = Router();

// seller information
router.get("/", async (req, res) => {
  const userId = req.user.id;
  const { handle = null } = req.query;

  if (handle === null && req.user.isSeller === false)
    // if user is not a seller
    return res
      .status(c.BAD_REQUEST)
      .json({ message: "You don't have a seller account" });

  try {
    const sellerInfo = await Seller.findOne({
      where: { ...(handle === null ? { userId } : { handle }) },
      attributes: ["name", "products"],
      include: [
        {
          model: Address,
          foreignKey: "sellerId",
          attributes: { exclude: ["sellerId", "id", "customerId"] },
        },
      ],
    });

    if (sellerInfo === null)
      return res
        .status(c.BAD_REQUEST)
        .json({ message: "No seller with that handle" });

    const _sellerInfo = {
      name: sellerInfo.name,
      products: sellerInfo.products,
      branches: sellerInfo.Addresses,
    };

    res.status(c.OK).json({
      message: `${handle === null ? "" : "Your "}Seller Info`,
      info: _sellerInfo,
    });
  } catch (err) {
    console.log(err);
    res
      .status(c.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
});

// get products by seller
router.get("/products", async (req, res) => {
  const sellerId = req.user.seller.id;

  if (req.user.isSeller === false)
    return res.status(c.FORBIDDEN).json({ message: "You are not a seller" });

  const { offset = 0 } = req.query;

  try {
    const products = await Product.findAll({
      where: { sellerId },
      attributes: { exclude: ["id", "sellerId"] },
      include: [
        { model: Variant, attributes: { exclude: ["id", "productId"] } },
      ],
      limit: SELLER_LIMIT,
      offset,
    });

    res.status(c.OK).json({ message: "Your products", products });
  } catch (err) {
    console.log(err);

    res
      .status(c.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
});

// convert to seller account
router.post("/new", async (req, res) => {
  const userId = req.user.id;
  const username = req.user.username;
  const { name = null, password = null } = req.body;

  if (req.user.isSeller === true)
    return res
      .status(c.BAD_REQUEST)
      .json({ message: "You are already a seller" });

  const t = await db.transaction();
  try {
    if (name === null || password === null)
      return res
        .status(c.BAD_REQUEST)
        .json({ message: "Required credentials not given" });

    // take user's password again to verify it is user
    {
      const user = await User.findOne({
        where: { id: userId, username },
        attributes: ["password"],
      });

      if (!_password.comparePassword(username, password, user.password))
        return res.status(c.UNAUTHORIZED).json({ message: "Password wrong" });
    }

    const sellerHandle = handle.create(name, Date.now().toString());

    const seller = await Seller.create(
      { name, handle: sellerHandle, userId },
      { transaction: t }
    );
    await t.commit();

    await auth.resetup(req, res); // update the cookies for user

    res
      .status(c.CREATED)
      .json({ message: "Seller account created", handle: seller.handle });
  } catch (err) {
    await t.rollback();
    console.log(err);

    res
      .status(c.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
});

// patch the seller info
router.patch("/", async (req, res) => {
  // TODO: complete these functions
});

// update the seller info
router.put("/", async (req, res) => {
  // TODO: complete these functions
});

// delete seller account
router.delete("/", async (req, res) => {
  const userId = req.user.id;

  const t = await db.transaction();
  try {
    const user = await User.findByPk(userId, { attributes: ["isSeller"] });
    if (user.isSeller === false)
      return res
        .status(c.BAD_REQUEST)
        .json({ message: "You don't have a seller account" });

    const destroyResult = await Seller.destroy({
      where: { userId },
      transaction: t,
      individualHooks: true,
    });
    await t.commit();

    await auth.resetup(req, res);

    res.sendStatus(c.NO_CONTENT);
  } catch (err) {
    await t.rollback();
    console.log(err);

    res
      .status(c.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
});

export const SellerRouter = router;
