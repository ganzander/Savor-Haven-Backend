const mongoose = require("mongoose");
const foodItem = require("../models/FoodItem");
const foodCategory = require("../models/FoodCategory");

async function createFood(req, res) {
  req.body.options = JSON.parse(req.body.options);
  const newFood = new foodItem({
    name: req.body.name,
    CategoryName: req.body.categoryName,
    img: req.body.imgurl,
    options: req.body.options,
    description: req.body.description,
  });
  const query = { name: req.body.name };
  const duplicateFood = await foodItem.findOne(query);
  if (duplicateFood !== null) {
    res.send({ Success: false });
  } else {
    const foodSave = {
      name: req.body.name,
      CategoryName: req.body.categoryName,
      img: req.body.imgurl,
      options: req.body.options,
      description: req.body.description,
    };

    await foodItem.create(foodSave);
    const query2 = { CategoryName: req.body.categoryName };

    const duplicateCategory = await foodCategory.findOne(query);

    if (duplicateCategory === null) {
      const categorySave = {
        CategoryName: req.body.categoryName,
      };
      await foodCategory.create(categorySave);
    }
    res.send({ Success: true });
  }
}

async function getFood(req, res) {
  const foodItems = await foodItem.find({});

  if (foodItems.length !== 0) {
    res.send({
      Success: "true",
      foodItem: foodItems,
    });
  } else {
    res.json({ Success: "false" });
  }
}

module.exports = { createFood, getFood };
