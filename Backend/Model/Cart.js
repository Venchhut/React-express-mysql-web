const { DataTypes } = require("sequelize");
const sequelize = require("./connectdb");
const Cart = sequelize.define("Cart", {
  // Model attributes are defined here
  Quantity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
module.exports = Cart;
