import { Router } from "express";
import Cart from "../models/Cart.js";
import attr from "../constants/db.js";
import ProductCart from "../models/ProductCart.js";
import c from "../utils/status_codes.js";
import Product from "../models/products/Product.js";
import Seller from "../models/Seller.js";
import Variant from "../models/products/Variant.js";
import { db } from "../db/connect.js";

const router = Router();

// get products in cart
router.get("/", async (req, res) => {
  const customerId = req.user.customer.id;

  const { offset = 0 } = req.query;

  try {
    const cart = await Cart.findOne({
      where: { customerId },
      attributes: { exclude: ["id", "customerId"] },
      include: [
        {
          model: ProductCart,
          as: "products",
          attributes: { exclude: ["id", "cartId", "variantId"] },
          include: [
            {
              model: Variant,
              attributes: { exclude: ["id", "productId"] },
              include: [
                {
                  model: Product,
                  foreignKey: "productId",
                  attributes: { exclude: ["id", "sellerId"] },
                  include: [
                    {
                      model: Variant,
                      attributes: { exclude: ["id", "productId"] },
                    },
                    {
                      model: Seller,
                      foreignKey: "sellerId",
                      as: "seller",
                      attributes: ["name", "handle"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    // sync the items number in cart
    // after deleting a product, the items was not updating *
    // so had to do a sync here *
    // no await for ux
    const updateResult = Cart.update(
      { items: cart?.products.length ?? 0 },
      { where: { customerId }, individualHooks: true }
    );

    // customize the cart
    const _cart = {
      items: cart?.products.length,
      updatedAt: cart.updatedAt,
    };

    if (cart?.products.length > 0) {
      _cart.products = []; // reorder products info in cart
      for (const product of cart.products) {
        const _product = {
          items: product.items,
          product: product.Variant.Product,
          variant: {
            name: product.Variant.name,
            price: product.Variant.price,
            createdAt: product.Variant.createdAt,
            updatedAt: product.Variant.updatedAt,
          },
        };

        _cart.products.push(_product);
      }
    }

    res.status(c.OK).json({ message: "Your Cart", cart: _cart });
  } catch (err) {
    console.log(err);

    res
      .status(c.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
});

// update the cart with products
router.patch("/add", async (req, res) => {
  const cartId = req.user.customer.cart.id;

  const {
    productHandle = null,
    items = 0,
    variantName = attr.default.STRING,
  } = req.body;

  if (
    productHandle === null ||
    items < 1 ||
    variantName === null ||
    variantName === undefined
  )
    return res
      .status(c.BAD_REQUEST)
      .json({ message: "Nothing to add in cart" });

  const t = await db.transaction();
  try {
    const product = await Product.findOne({ where: { handle: productHandle } });
    if (product === null)
      return res
        .status(c.BAD_REQUEST)
        .json({ message: "No product with that handle" });

    const pVariant = await Variant.findOne({
      where: { productId: product.id, name: variantName },
    });
    if (pVariant === null)
      return res
        .status(c.BAD_REQUEST)
        .json({ message: "No variant of this product with that handle" });

    const alreadyCarted = await ProductCart.findOne({
      where: { variantId: pVariant.id, cartId },
    });

    if (alreadyCarted === null) {
      const pCart = await ProductCart.create(
        { variantId: pVariant.id, items, cartId },
        { transaction: t }
      );
    } else {
      const updatedResult = await ProductCart.update(
        { items },
        {
          where: { variantId: pVariant.id, cartId },
          transaction: t,
          individualHooks: true,
        }
      );
    }

    await t.commit();

    res.status(c.OK).json({
      message: `Product ${alreadyCarted === null ? "added" : "updated"}`,
    });
  } catch (err) {
    await t.rollback();
    console.log(err);

    res
      .status(c.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
});

// remove product from cart
router.patch("/remove", async (req, res) => {
  const cartId = req.user.customer.cart.id;

  const { productHandle = null, variantName = attr.default.STRING } = req.body;

  if (
    productHandle === null ||
    variantName === null ||
    variantName === undefined
  )
    return res
      .status(c.BAD_REQUEST)
      .json({ message: "Nothing to add in cart" });

  const t = await db.transaction();
  try {
    const product = await Product.findOne({ where: { handle: productHandle } });
    if (product === null)
      return res
        .status(c.BAD_REQUEST)
        .json({ message: "No product with that handle" });

    const pVariant = await Variant.findOne({
      where: { productId: product.id, name: variantName },
    });
    if (pVariant === null)
      return res
        .status(c.BAD_REQUEST)
        .json({ message: "No variant of this product with that handle" });

    const destoryResult = await ProductCart.destroy({
      where: { variantId: pVariant.id, cartId },
      transaction: t,
      individualHooks: true,
    });
    if (destoryResult === 0) {
      await t.rollback();
      return res.status(c.BAD_REQUEST).json({ message: "It was never added" });
    }

    await t.commit();

    res.status(c.OK).json({ message: "Product removed" });
  } catch (err) {
    await t.rollback();
    console.log(err);

    res
      .status(c.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
});

export const CartRouter = router;
