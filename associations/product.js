import Product from "../models/products/Product.js";
import Variant from "../models/products/Variant.js";
import Seller from "../models/Seller.js";

const productAssociations = () => {
  // a product can have many variants
  Product.hasMany(Variant, { foreignKey: "productId", onDelete: "CASCADE" });
  Variant.belongsTo(Product, { foreignKey: "productId" });

  // increase products when created
  Product.afterCreate(async (payload, options) => {
    await Seller.increment("products", {
      by: 1,
      where: { id: payload.sellerId },
      transaction: options.transaction,
    });
  });

  // decrease products when created
  Product.afterDestroy(async (payload, options) => {
    await Seller.decrement("products", {
      by: 1,
      where: { id: payload.sellerId },
      transaction: options.transaction,
    });
  });

  // increments the products variants number upon creating
  Variant.beforeCreate(async (payload, options) => {
    await Product.increment("variants", {
      by: 1,
      where: { id: payload.productId },
      transaction: options.transaction,
    });
  });
};

export default productAssociations;
