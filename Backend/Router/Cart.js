const { Router } = require("express");
const router = Router();
const Cart = require("../Model/Cart");
const user = require("../Model/User");
const product = require("../Model/Product");
const Product = require("../Model/Product");
const { verifyUser } = require("../Middleware/isAdmin");
const { where } = require("sequelize");

// cart
router.post("/:productId", verifyUser, async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.User.id;
    const { Quantity } = req.body;

    // Check if the cart item already exists for the user and product combination
    const existingCartItem = await Cart.findOne({
      where: { UserId: userId, ProductId: productId },
      include: [Product],
    });

    if (existingCartItem) {
      // If cart item exists, update the quantity
      if (
        existingCartItem.Quantity < parseInt(existingCartItem.Product.Quantity)
      ) {
        const remainingStock =
          parseInt(existingCartItem.Product.Quantity) -
          existingCartItem.Quantity;

        // Check if the requested quantity is available in stock
        if (Quantity <= remainingStock) {
          existingCartItem.Quantity += parseInt(Quantity);
        } else {
          return res
            .status(400)
            .json({ error: "Requested quantity exceeds available stock" });
        }
      } else {
        return res.status(400).json({ error: "Out of stock" });
      }

      await existingCartItem.save();
      return res.status(200).json(existingCartItem);
    } else {
      // If cart item does not exist, create a new one
      const product = await Product.findByPk(productId);

      if (product) {
        // Check if the requested quantity is available in stock
        if (Quantity <= product.Quantity) {
          const cartdb = await Cart.create({
            Quantity,
            UserId: userId,
            ProductId: productId,
          });
          return res.status(200).json(cartdb);
        } else {
          return res
            .status(400)
            .json({ error: "Requested quantity exceeds available stock" });
        }
      } else {
        return res.status(400).json({ message: "Product doesn't exist" });
      }
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//   get cart
router.get("/find", verifyUser, async (req, res) => {
  try {
    const userId = req.User.id;
    const carts = await Cart.findAll({
      where: { UserId: userId },
      include: [{ model: Product }],
    });
    res.status(200).json(carts);
  } catch (error) {
    res.status(300).json({ message: error.message });
  }
});
// delete cart

router.delete("/:productId", verifyUser, async (req, res) => {
  try {
    const userId = req.User.id;
    const productID = req.params.productId;
    const cartItem = await Cart.findOne({
      where: { ProductId: productID, UserId: userId },
    });

    if (cartItem) {
      // If the cart item exists, delete it
      await cartItem.destroy();
      res.status(200).json({ message: "Delete Successfully" });
    } else {
      // If the cart item does not exist, send an error response
      res.status(404).json({ message: "Cart item not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle any errors
  }
});
// Update Cart
router.patch("/:productId", verifyUser, async (req, res) => {
  try {
    const productId = req.params.productId;
    const { action } = req.body;

    // Find the cart item with the given productId and include the associated Product details
    const cartItem = await Cart.findOne({
      where: { ProductId: productId },
      include: [Product],
    });

    // If the cart item is not found, return a 404 response with an error message
    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    // Update the cart item quantity based on the provided action
    if (action === "increase") {
      // Increase quantity
      if (cartItem.Quantity < parseInt(cartItem.Product.Quantity)) {
        cartItem.Quantity += 1;
      } else {
        return res.status(300).json({ error: "Out of stock" });
      }
    } else if (action === "decrease") {
      // Decrease quantity (if it's greater than 1)
      if (cartItem.Quantity > 1) {
        cartItem.Quantity -= 1;
      } else {
        return res
          .status(400)
          .json({ error: "Quantity cannot be less than 1" });
      }
    } else {
      // Invalid action provided
      return res.status(400).json({ error: "Invalid action" });
    }

    // Save the updated cart item
    await cartItem.save();

    // Return a 200 response with the updated cart item as the JSON response
    res.status(200).json(cartItem);
  } catch (error) {
    // Handle any errors that might occur during the process
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
