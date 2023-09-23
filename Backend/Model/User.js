const { DataTypes } = require("sequelize");
const sequelize = require("./connectdb");
const User = sequelize.define("User", {
  // Model attributes are defined here
  Username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    // allowNull defaults to true
    isEmail: true, // checks for email format (foo@bar.com)
  },
  password: {
    type: DataTypes.STRING,
    allownull: false,
    unique: true,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});
module.exports = User;
