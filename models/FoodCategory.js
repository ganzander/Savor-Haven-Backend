const mongoose = require("mongoose");

const FoodCategorySchema = new mongoose.Schema({
  CategoryName: {
    type: String,
  },
});

module.exports = mongoose.model("food_categories", FoodCategorySchema);
