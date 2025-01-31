import { DataTypes as dt } from "sequelize";
import attr from "../../constants/db.js";
import { db } from "../../db/connect.js";

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

export default Product;
