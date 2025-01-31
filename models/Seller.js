import { DataTypes as dt } from "sequelize";
import attr from "../constants/db.js";
import { db } from "../db/connect.js";

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

export default Seller;
