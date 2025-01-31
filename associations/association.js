import userAssociations from "./user.js";
import sellerAssociations from "./seller.js";
import productAssociations from "./product.js";
import productCartAssociations from "./product_cart.js";
import customerAssociations from "./customer.js";
import cartAssociations from "./cart.js";
import { db } from "../db/connect.js";

const initAssociations = () => {
  userAssociations();
  sellerAssociations();
  productAssociations();
  productCartAssociations();
  customerAssociations();
  cartAssociations();

  // sync database after associations are done
  db.sync({ alter: true });
};

export default initAssociations;
