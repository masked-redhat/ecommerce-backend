import { DataTypes as dt } from "sequelize";
import attr from "../constants/db.js";
import { db } from "../db/connect.js";
import Product from "./products/Product.js";
import Address from "./Address.js";

const Seller = db.define("Seller", {
  id: attr.id,
  name: {
    type: dt.TEXT,
    allowNull: false,
    set(value) {
      this.setDataValue("username", value.trim());
    },
  },
  products: {
    type: dt.INTEGER,
    allowNull: false,
    defaultValue: attr.default.INTEGER ?? 0,
  },
});

// Seller has many products
Seller.hasMany(Product, { foreignKey: "sellerId", onDelete: "CASCADE" });
Product.belongsTo(Seller, { foreignKey: "sellerId" });

// Seller can have many branches at different addresses
Seller.hasMany(Address, { foreignKey: "sellerId", onDelete: "SET NULL" });
Address.belongsTo(Seller, { foreignKey: "sellerId" });

export default Seller;
