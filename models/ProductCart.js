import { DataTypes as dt } from "sequelize";
import attr from "../constants/db.js";
import { db } from "../db/connect.js";
import Variant from "./products/Variant.js";

const ProductCart = db.define("ProductCart", {
  id: attr.id,
  items: {
    type: dt.INTEGER,
    allowNull: false,
    defaultValue: attr.default.INTEGER + 1 ?? 1,
  },
});

// a product cart will have one variant of a product
Variant.hasMany(ProductCart, { foreignKey: "pCartId", onDelete: "SET NULL" });
ProductCart.belongsTo(Variant, { foreignKey: "pCartId" });

export default ProductCart;
