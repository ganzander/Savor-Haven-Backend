const express = require("express");
const router = express.Router();

const {
  postCart,
  getCartData,
  deleteCart,
  deleteCartItem,
} = require("../controllers/cartContoller");

router.post("/cartItems", postCart);
router.post("/deleteItems", deleteCart);
router.post("/deleteCartItem", deleteCartItem);
router.post("/cartUser", getCartData);

module.exports = router;
