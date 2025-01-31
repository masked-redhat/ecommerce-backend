import { DataTypes as dt } from "sequelize";
import attr from "../constants/db.js";
import { db } from "../db/connect.js";
import Product from "./products/Product.js";
import Address from "./Address.js";
import User from "./User.js";

const Seller = db.define("Seller", {
  id: attr.id,
  name: {
    type: dt.TEXT,
    allowNull: false,
    set(value) {
      this.setDataValue("name", value.trim());
    },
  },
  handle: {
    type: dt.STRING,
    allowNull: false,
    unique: true,
  },
  products: {
    type: dt.INTEGER,
    allowNull: false,
    defaultValue: attr.default.INTEGER ?? 0,
  },
});

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

export default Seller;
