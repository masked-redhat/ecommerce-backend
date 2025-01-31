import Address from "../models/Address.js";
import Product from "../models/products/Product.js";
import Seller from "../models/Seller.js";
import User from "../models/User.js";

const sellerAssociations = () => {
  // Seller has many products
  Seller.hasMany(Product, { foreignKey: "sellerId", onDelete: "CASCADE" });
  Product.belongsTo(Seller, { foreignKey: "sellerId", as: "seller" });

  // Seller can have many branches at different addresses
  Seller.hasMany(Address, { foreignKey: "sellerId", onDelete: "SET NULL" });
  Address.belongsTo(Seller, { foreignKey: "sellerId" });

  // set user's isSeller to true after creating a seller account
  Seller.afterCreate(async (payload, options) => {
    await User.update(
      { isSeller: true },
      { where: { id: payload.userId }, transaction: options.transaction }
    );
  });

  // set user's isSeller to false after deleting a seller account
  Seller.beforeDestroy(async (payload, options) => {
    await User.update(
      { isSeller: false },
      { where: { id: payload.userId }, transaction: options.transaction }
    );
  });
};

export default sellerAssociations;
