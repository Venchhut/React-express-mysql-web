const { Router } = require("express");
const router = Router();

const Order = require("../Model/Order");
const Cart = require("../Model/Cart");
const { verifyUser, verifyAdmin } = require("../Middleware/isAdmin");
const User = require("../Model/User");
const OrderDetail = require("../Model/OrderDetail");
const Product = require("../Model/Product");
// post order

router.post("/", verifyUser, async (req, res) => {
  try {
    const userId = req.User.id;
    const { email, address, phonenumber, OrderDetails } = req.body;

    // Get information about cart items from the "Cart" table based on userId
    const cartItems = await Cart.findAll({ where: { UserId: userId } });

    // Create an order and corresponding order items in the "Order" and "OrderItem" tables
    const order = await Order.create({
      UserId: userId,
      Email: email,
      Address: address,
      Phonenumber: phonenumber,
    });

    // Create order details for each productId in the productIds array
    for (const orderPost of OrderDetails) {
      await OrderDetail.create({
        OrderId: order.id,
        ProductId: orderPost.productId,
        Quantity: orderPost.quantity,
      });
    }

    // Optionally, delete cart items after successfully creating the order
    await Cart.destroy({ where: { UserId: userId } });

    return res
      .status(201)
      .json({ message: "Đơn hàng đã được tạo thành công." });
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    return res.status(500).json({ error: "Đã xảy ra lỗi khi tạo đơn hàng." });
  }
});

router.get("/", verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: Product }, { model: User }],
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Route to delete an order by its ID
router.delete("/:orderId", verifyAdmin, async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const order = await Order.findByPk(orderId);

    if (order) {
      await order.destroy();
      res.json({ message: `Order with ID ${orderId} deleted successfully.` });
    } else {
      res.status(404).json({ message: "Order not found." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.patch("/:orderId", verifyAdmin, async (req, res) => {
  const orderId = req.params.orderId;
  const { status } = req.body;

  try {
    const order = await Order.findByPk(orderId);

    if (order) {
      order.status = status; // Update the status with the new value from the request body
      await order.save(); // Save the updated order
      res.json({ message: `Order with ID ${orderId} updated successfully.` });
    } else {
      res.status(404).json({ message: "Order not found." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
