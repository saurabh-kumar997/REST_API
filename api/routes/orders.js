const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");
const ordersController = require("../controllers/orders");

router.get("/", checkAuth, ordersController.orders_get_all);

router.get("/:orderID", checkAuth, ordersController.orders_get_order_by_id);

router.post("/", checkAuth, ordersController.orders_place_order);

router.delete(
  "/:orderID",
  checkAuth,
  ordersController.orders_delete_order_by_id
);

module.exports = router;
