import { DataTypes as dt } from "sequelize";
import { db } from "../../db/connect.js";
import attr from "../../constants/db.js";

const Variant = db.define("Variant", {
  id: attr.id,
  name: {
    type: dt.STRING,
    allowNull: false,
    unique: true,
  },
  price: {
    type: dt.INTEGER,
    allowNull: false,
  },
});

export default Variant;
