import ProductCart from "../models/ProductCart.js";
import Variant from "../models/products/Variant.js";

const productCartAssociations = () => {
  // a product cart will have one variant of a product
  Variant.hasMany(ProductCart, { foreignKey: "pCartId", onDelete: "SET NULL" });
  ProductCart.belongsTo(Variant, { foreignKey: "pCartId" });
};

export default productCartAssociations;
