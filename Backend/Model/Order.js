const { DataTypes } = require("sequelize");
const sequelize = require("./connectdb");
const Order = sequelize.define("Order", {
  // Model attributes are defined here
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  Address: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    // allowNull defaults to true
    isEmail: true, // checks for email format (foo@bar.com)
  },
  Phonenumber: {
    type: DataTypes.STRING,
    allownull: false,
    unique: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Pedding",
  },
});
module.exports = Order;
