import { DataTypes as dt } from "sequelize";
import attr from "../constants/db.js";
import { db } from "../db/connect.js";
import Customer from "./Customer.js";
import Seller from "./Seller.js";
import bcryptjs from "bcryptjs";
import pass from "../constants/password.js";

const User = db.define("User", {
  id: attr.id,
  username: {
    type: dt.STRING,
    unique: true,
    allowNull: false,
    set(value) {
      this.setDataValue("username", value.trim());
    },
  },
  password: {
    type: dt.STRING,
    allowNull: false,
    set(value) {
      const updatedPassword = pass.secret + value + this.username; // join secret and username to password
      this.setDataValue("password", bcryptjs.hashSync(updatedPassword, pass.salt)); // hash password and save
    },
  },
  blocked: {
    type: dt.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  isSeller: {
    type: dt.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
});

// A user can be only one customer,
User.hasOne(Customer, { foreignKey: "userId", onDelete: "CASCADE" });
Customer.belongsTo(User, { foreignKey: "userId" });

// and one seller
User.hasOne(Seller, { foreignKey: "userId", onDelete: "CASCADE" });
Seller.belongsTo(User, { foreignKey: "userId" });

export default User;
