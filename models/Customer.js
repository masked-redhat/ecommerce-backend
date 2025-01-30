import { DataTypes as dt } from "sequelize";
import attr from "../constants/db.js";
import { db } from "../db/connect.js";
import Cart from "./Cart.js";
import Address from "./Address.js";

const Customer = db.define("Customer", {
  id: attr.id,
  firstName: {
    type: dt.STRING,
    allowNull: false,
  },
  lastName: dt.STRING,
  age: dt.INTEGER,
});

// A customer has only one cart
Customer.hasOne(Cart, { foreignKey: "customerId", onDelete: "CASCADE" });
Cart.belongsTo(Customer, { foreignKey: "customerId" });

// A customer can have many addresses
Customer.hasMany(Address, { foreignKey: "customerId", onDelete: "SET NULL" });
Address.belongsTo(Customer, { foreignKey: "customerId" });

export default Customer;
