import { DataTypes as dt } from "sequelize";
import attr from "../../constants/db.js";
import { db } from "../../db/connect.js";
import Variant from "./Variant.js";

const Product = db.define("Product", {
  id: attr.id,
  name: {
    type: dt.TEXT,
    allowNull: false,
  },
  description: dt.TEXT,
  handle: {
    type: dt.STRING,
    allowNull: false,
    unique: true,
  },
  variantTitle: {
    type: dt.STRING,
    allowNull: false,
    defaultValue: attr.default.STRING,
  },
  variants: {
    type: dt.INTEGER,
    allowNull: false,
    defaultValue: attr.default.INTEGER ?? 0,
  },
});

// a product can have many variants
Product.hasMany(Variant, {
  foreignKey: "productId",
  onDelete: "SET NULL",
});
Variant.belongsTo(Product, { foreignKey: "productId" });

// increments the products variants number upon creating
Variant.beforeCreate(async (payload, options) => {
  await Product.increment("variants", {
    by: 1,
    where: { id: payload.productId },
    transaction: options.transaction,
  });
});

export default Product;
