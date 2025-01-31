import Cart from "../models/Cart.js";
import ProductCart from "../models/ProductCart.js";

const cartAssociations = () => {
  // a cart will have many product carts
  Cart.hasMany(ProductCart, {
    foreignKey: "cartId",
    onDelete: "CASCADE",
    as: "products",
  });
  ProductCart.belongsTo(Cart, { foreignKey: "cartId", as: "products" });
};

export default cartAssociations;
