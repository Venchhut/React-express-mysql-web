const Cart = require("./Cart");
const Order = require("./Order");
const OrderDetail = require("./OrderDetail");
const Product = require("./Product");
const User = require("./User");
const Relationship = () => {
  User.hasMany(Order);
  Order.belongsTo(User);
  Order.belongsToMany(Product, { through: OrderDetail });
  Product.belongsToMany(Order, { through: OrderDetail });
  User.belongsToMany(Product, { through: Cart });
  Product.belongsToMany(User, { through: Cart });
  User.hasMany(Cart);
  Cart.belongsTo(User);
  Product.hasMany(Cart);
  Cart.belongsTo(Product);
};
module.exports = Relationship;
