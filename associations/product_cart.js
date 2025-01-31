import Cart from "../models/Cart.js";
import ProductCart from "../models/ProductCart.js";
import Variant from "../models/products/Variant.js";

const productCartAssociations = () => {
  // a product cart will have one variant of a product
  Variant.hasMany(ProductCart, { foreignKey: "variantId", onDelete: "CASCADE" });
  ProductCart.belongsTo(Variant, { foreignKey: "variantId" });

  // Creating product cart adds in cart
  ProductCart.afterCreate(async (payload, options) => {
    await Cart.increment("items", {
      by: 1,
      where: { id: payload.cartId },
      transaction: options.transaction,
    });
  });

  // deleting product cart removes from cart
  ProductCart.beforeDestroy(async (payload, options) => {
    await Cart.decrement("items", {
      by: 1,
      where: { id: payload.cartId },
      transaction: options.transaction,
    });
  });
};

export default productCartAssociations;
