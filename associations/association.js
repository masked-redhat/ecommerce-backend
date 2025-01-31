import userAssociations from "./user.js";
import sellerAssociations from "./seller.js";
import productAssociations from "./product.js";
import productCartAssociations from "./product_cart.js";
import customerAssociations from "./customer.js";
import cartAssociations from "./cart.js";

const initAssociations = () => {
  userAssociations();
  sellerAssociations();
  productAssociations();
  productCartAssociations();
  customerAssociations();
  cartAssociations();
};

export default initAssociations;
