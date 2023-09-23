const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("shopdb", "root", "mysql@123456", {
  host: "localhost",
  dialect: "mysql" /* one of 'mysql'  */,
});
sequelize
  .authenticate()
  .then(() => {
    console.log("connect success.");
  })
  .catch((error) => {
    console.error("unable to connect", error);
  });
module.exports = sequelize;
