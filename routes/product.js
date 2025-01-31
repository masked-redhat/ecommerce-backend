import { Router } from "express";
import c from "../utils/status_codes.js";
import Product from "../models/products/Product.js";
import { db } from "../db/connect.js";
import Variant from "../models/products/Variant.js";
import handle from "../utils/handle.js";
import Seller from "../models/Seller.js";
import attr from "../constants/db.js";

const router = Router();

const CUSTOMER_LIMIT = attr.product.customer.limit;

// get product details
router.get("/:handle", async (req, res) => {
  const { handle } = req.params;

  try {
    const productDetails = await Product.findOne({
      where: { handle },
      attributes: { exclude: ["id", "sellerId"] },
      include: [
        {
          model: Seller,
          foreignKey: "sellerId",
          attributes: ["name", "handle"],
          as: "seller",
        },
        {
          model: Variant,
          attributes: { exclude: ["id", "productId"] },
        },
      ],
    });

    if (productDetails === null)
      return res
        .status(c.BAD_REQUEST)
        .json({ message: "No product like that" });

    res.status(c.OK).json({
      message: "Got product details for you",
      details: productDetails,
    });
  } catch (err) {
    console.log(err);

    res
      .status(c.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
});

// get products
router.get("/", async (req, res) => {
  const { offset = 0 } = req.query;

  try {
    const products = await Product.findAll({
      attributes: ["name", "handle"],
      include: [
        { model: Variant, attributes: { exclude: ["id", "productId"] } },
      ],
      limit: CUSTOMER_LIMIT,
      offset,
    });

    res.status(c.OK).json({ message: "Products", products });
  } catch (err) {
    console.log(err);

    res
      .status(c.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
});

// add a product
router.post("/", async (req, res) => {
  const sellerId = req.user.seller?.id;

  if (req.user.isSeller === false)
    return res.status(c.FORBIDDEN).json({ message: "Not a seller account" });

  const {
    name = null,
    description = null,
    variantTitle = null,
    variants = [],
    price = null,
  } = req.body;

  if (
    name === null ||
    variants === null ||
    (variants.length === 0 && price === null)
  )
    return res
      .status(c.BAD_REQUEST)
      .json({ message: "Required information not given" });

  if (variants.length === 0)
    variants.push({ name: attr.default.STRING, price });

  for (const variant of variants) {
    if (typeof variant?.name !== "string" || typeof variant?.price !== "number")
      return res
        .status(c.BAD_REQUEST)
        .json({ message: "Required formatting not applied" });
  }

  // all checks done

  const t = await db.transaction();
  try {
    const productHandle = handle.create(name, Date.now().toString());
    const product = await Product.create(
      {
        name,
        description,
        ...(variantTitle === null ? {} : { variantTitle }),
        handle: productHandle,
        sellerId,
      },
      { transaction: t }
    );

    for (const variant of variants) {
      await Variant.create(
        {
          name: variant.name,
          price: variant.price,
          productId: product.id,
        },
        { transaction: t }
      );
    }

    await t.commit();

    res
      .status(c.CREATED)
      .json({ message: "Product created", handle: product.handle });
  } catch (err) {
    await t.rollback();
    console.log(err);

    res
      .status(c.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
});

// update the product details
router.patch("/", async (req, res) => {
  // TODO: create function to update product features
});

// update the product details
router.put("/", async (req, res) => {
  // TODO: create function to update product features
});

// delete the product
router.delete("/:handle", async (req, res) => {
  const sellerId = req.user.seller?.id;

  if (req.user.isSeller === false)
    return res.status(c.FORBIDDEN).json({ message: "You are not a seller" });

  const { handle } = req.params;

  const t = await db.transaction();
  try {
    const destroyResult = await Product.destroy({
      where: { handle, sellerId },
      transaction: t,
      individualHooks: true,
    });

    await t.commit();

    res.sendStatus(c.NO_CONTENT);
  } catch (err) {
    await t.rollback();
    console.log(err);

    res
      .status(c.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
});

export const ProductRouter = router;
