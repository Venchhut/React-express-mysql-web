const { DataTypes } = require("sequelize");
const sequelize = require("./connectdb");
const OrderDetail = sequelize.define("OrderDetail", {
  // Model attributes are defined here
  Quantity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
module.exports = OrderDetail;
