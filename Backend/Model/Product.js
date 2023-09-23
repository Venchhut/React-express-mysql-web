const { DataTypes } = require("sequelize");
const sequelize = require("./connectdb");
const Product = sequelize.define("Product", {
  // Model attributes are defined here
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    // allowNull defaults to true
    isEmail: true, // checks for email format (foo@bar.com)
  },
  Desc: {
    type: DataTypes.STRING,
    allownull: false,
    // unique: true,
  },
  Price: {
    type: DataTypes.STRING,
    allownull: false,
    // unique: true,
  },
  Quantity: {
    type: DataTypes.STRING,
    allownull: false,
    // unique: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Product;
