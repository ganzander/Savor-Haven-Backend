const express = require("express");
const router = express.Router();

const {
  createUser,
  loginUser,
  sendOTP,
  changePassword,
  updateImage,
  payment,
} = require("../controllers/userController");

router.post("/createuser", createUser);
router.post("/loginuser", loginUser);
router.post("/user/sendotp", sendOTP);
router.post("/api/create-checkout-session", payment);
router.post("/changePassword", changePassword);
router.post("/uploadImage", updateImage);

module.exports = router;
