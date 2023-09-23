const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const Relationship = require("./Model/Relationship");
const sequelize = require("./Model/connectdb");
const Userrouter = require("./Router/User");
const Productrouter = require("./Router/Product");
const Orderrouter = require("./Router/Order");
const Cartrouter = require("./Router/Cart");
const cookieParser = require("cookie-parser");
const imageRoutes = require("./Router/imageRoutes");
const app = express();
const port = 8000; // Choose a port number that is not in use
dotenv.config();
Relationship();
sequelize
  .sync()
  .then((result) => {
    console.log("You created table success!");
  })
  .catch((err) => {
    console.log("You didn't create table yet!", err);
  });

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/api/user", Userrouter);
app.use("/api/product", Productrouter);
app.use("/api/order", Orderrouter);
app.use("/api/cart", Cartrouter);
app.use("/images", imageRoutes);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
