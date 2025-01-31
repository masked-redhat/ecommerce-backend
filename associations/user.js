import Customer from "../models/Customer.js";
import Seller from "../models/Seller.js";
import User from "../models/User.js";

const userAssociations = () => {
  // A user can be only one customer,
  User.hasOne(Customer, { foreignKey: "userId", onDelete: "CASCADE" });
  Customer.belongsTo(User, { foreignKey: "userId" });

  // and one seller
  User.hasOne(Seller, { foreignKey: "userId", onDelete: "CASCADE" });
  Seller.belongsTo(User, { foreignKey: "userId" });

  // customer will be created at user creation
  User.afterCreate(async (payload, options) => {
    await Customer.create(
      { firstName: payload.username, userId: payload.id },
      { transaction: options.transaction }
    );
  });
};

export default userAssociations;
