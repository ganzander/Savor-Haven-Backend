const express = require("express");
const router = express.Router();

const { getFood, createFood } = require("../controllers/foodItemController");
const { getFoodCategory } = require("../controllers/foodCategoryController");

router.post("/createFood", createFood);
router.get("/foodItems", getFood);
router.get("/foodCategory", getFoodCategory);

module.exports = router;
