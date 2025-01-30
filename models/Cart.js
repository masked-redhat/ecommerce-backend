import { DataTypes as dt } from "sequelize";
import attr from "../constants/db.js";
import { db } from "../db/connect.js";
import ProductCart from "./ProductCart.js";

const Cart = db.define("Cart", {
  id: attr.id,
  items: {
    type: dt.INTEGER,
    allowNull: false,
    defaultValue: attr.default.INTEGER ?? 0,
  },
});

// a cart will have many product carts
Cart.hasMany(ProductCart, { foreignKey: "cartId", onDelete: "CASCADE" });
ProductCart.belongsTo(Cart, { foreignKey: "cartId" });

export default Cart;
