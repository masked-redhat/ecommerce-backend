import Address from "../models/Address.js";
import Cart from "../models/Cart.js";
import Customer from "../models/Customer.js";

const customerAssociations = () => {
  // A customer has only one cart
  Customer.hasOne(Cart, {
    foreignKey: "customerId",
    onDelete: "CASCADE",
    as: "cart",
  });
  Cart.belongsTo(Customer, { foreignKey: "customerId", as: "cart" });

  // A customer can have many addresses
  Customer.hasMany(Address, { foreignKey: "customerId", onDelete: "SET NULL" });
  Address.belongsTo(Customer, { foreignKey: "customerId" });

  // a cart for this customer
  Customer.afterCreate(async (payload, options) => {
    await Cart.create(
      { customerId: payload.id },
      { transaction: options.transaction }
    );
  });
};

export default customerAssociations;
