const CryptoJS = require("crypto-js");
const User = require("../Model/User");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

const { Router } = require("express");
const router = require("express").Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const isUser = await User.findOne({
      where: { [Op.or]: [{ Username: username }, { email: email }] },
    });
    const enpassword = CryptoJS.AES.encrypt(
      password,
      process.env.Admin
    ).toString();
    if (isUser === null) {
      const userdb = await User.create({
        Username: username,
        email: email,
        password: enpassword,
      });
      const { password, ...rest } = userdb.toJSON();
      return res.status(200).json(rest);
    } else {
      return res.status(400).json({ message: "user or email already exists" });
    }
  } catch (error) {
    console.log("error! try again", error);
    return res.status(500).json("Internal server error");
  }
});
// login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.body.username } });
    if (!user) {
      return res.status(401).json("Wrong username");
    }
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.Admin
    );
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    if (originalPassword !== req.body.password) {
      return res.status(401).json("Wrong password");
    }

    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
        username: user.username,
      },
      process.env.SC_TOKEN,
      { expiresIn: "3d" }
    );
    const { password, ...other } = user.toJSON();
    return res.status(200).json({ ...other, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal server error");
  }
});

// get user

// Assuming you have the necessary imports and sequelize instance set up

router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      where: { isAdmin: false },
    });

    res.json(users);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// get user order
router.get("/:id/order", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, {
      include: "orders", // assuming you have defined the association as 'orders'
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.orders);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
