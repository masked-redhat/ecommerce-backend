import { DataTypes as dt } from "sequelize";
import attr from "../constants/db.js";
import { db } from "../db/connect.js";

const Customer = db.define("Customer", {
  id: attr.id,
  firstName: {
    type: dt.STRING,
    allowNull: false,
  },
  lastName: dt.STRING,
  age: dt.INTEGER,
});

export default Customer;
