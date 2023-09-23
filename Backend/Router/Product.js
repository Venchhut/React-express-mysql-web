const { Router } = require("express");
const router = Router();
const { Op, where } = require("sequelize");
const Product = require("../Model/Product");
const authenticateToken = require("../Middleware/isAdmin");

// Get products
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [["id", "Desc"]],
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Create product
router.post("/", async (req, res) => {
  try {
    const { title, Desc, Price, image, category, Quantity } = req.body;
    console.log(req.body);
    const product = await Product.create({
      title,
      Desc,
      Price,
      image,
      category,
      Quantity,
    });

    res.status(201).json("you create success!");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Update product
router.patch("/:id", authenticateToken.verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const { title, Desc, Price, image, category } = req.body;
    console.log(req.body);
    await Product.update(
      { title, Desc, Price, image, category },
      { where: { id } }
    );
    res.status(200).json("Update success!");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Delete product
router.delete("/:id", authenticateToken.verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await Product.destroy({
      where: {
        id: id,
      },
    });
    res.status(200).json("Delete success!");
    // UPDATE "posts" SET "deletedAt"=[timestamp] WHERE "deletedAt" IS NULL AND "id" = 1
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Get product by ID

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const products = await Product.findByPk(id);
    if (!products) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (products.Quantity === "0") {
      return res
        .status(200)
        .json({ message: "Product is out of stock", products });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get products by category
router.get("/category/:category", async (req, res) => {
  const { category } = req.params;
  try {
    const product = await Product.findAll({
      where: {
        category,
      },
    });
    res.status(200).send(product);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
