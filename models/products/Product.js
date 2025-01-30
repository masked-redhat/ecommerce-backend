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
Product.hasMany(Variant, { foreignKey: "productId", onDelete: "SET NULL" });
Variant.belongsTo(Product, { foreignKey: "productId" });

export default Product;
