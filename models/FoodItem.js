const mongoose = require("mongoose");

const foodItemsSchema = new mongoose.Schema({
  CategoryName: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: "",
  },
  price: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("food_items", foodItemsSchema);
