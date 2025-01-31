import { DataTypes as dt } from "sequelize";
import attr from "../constants/db.js";
import { db } from "../db/connect.js";

const ProductCart = db.define("ProductCart", {
  id: attr.id,
  items: {
    type: dt.INTEGER,
    allowNull: false,
    defaultValue: attr.default.INTEGER + 1 ?? 1,
  },
});

export default ProductCart;
