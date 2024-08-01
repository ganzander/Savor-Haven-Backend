const express = require("express");
const router = express.Router();

const {
  getOrdersOfUser,
  postOrder,
} = require("../controllers/ordersController");

router.post("/order-Items", postOrder);
router.post("/orderedItems", getOrdersOfUser);

module.exports = router;
