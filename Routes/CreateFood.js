const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const foodItem = require("../models/FoodItem");
const foodCategory = require("../models/FoodCategory");
const uri = process.env.mongoURL;

mongoose
  .connect(uri)
  .then(console.log("connection successful"))
  .catch((err) => {
    console.log("some error in db connection");
    console.log(err);
  });

async function getFoodItems() {
  try {
    const foodItemArray = await foodItem.find({});

    return foodItemArray;
  } catch (err) {
    console.log("Something went wrong trying to find the documents:" + err);
  }
}

async function getFoodCategory() {
  try {
    const foodCategoryArray = await foodCategory.find({});
    return foodCategoryArray;
  } catch (err) {
    console.log("Something went wrong trying to find the documents:" + err);
  }
}

async function InsertFoodItem(newFood) {
  try {
    await foodItem.create(newFood);
    console.log("documents successfully inserted.");
  } catch (err) {
    console.log("Error while inserting" + err);
  }
}

async function FindFoodItem(query) {
  try {
    const foodFound = await foodItem.findOne(query);
    return foodFound;
  } catch (err) {
    console.log("Something went wrong trying to find the documents:" + err);
  }
}

async function InsertFoodCategory(newCategory) {
  try {
    await foodCategory.create(newCategory);
    console.log("documents successfully inserted.");
  } catch (err) {
    console.log("Error while inserting" + err);
  }
}

async function FindFoodCategory(query) {
  try {
    const categoryFound = await foodCategory.findOne(query);
    return categoryFound;
  } catch (err) {
    console.log("Something went wrong trying to find the documents:" + err);
  }
}

router.post("/createFood", async (req, res) => {
  req.body.options = JSON.parse(req.body.options);
  const newFood = new foodItem({
    name: req.body.name,
    CategoryName: req.body.categoryName,
    img: req.body.imgurl,
    options: req.body.options,
    description: req.body.description,
  });

  const query = { name: req.body.name };
  const duplicateFood = await FindFoodItem(query);

  console.log(duplicateFood);

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

    await InsertFoodItem(foodSave);
    const query2 = { CategoryName: req.body.categoryName };

    const duplicateCategory = await FindFoodCategory(query2);

    if (duplicateCategory === null) {
      const categorySave = {
        CategoryName: req.body.categoryName,
      };
      await InsertFoodCategory(categorySave);
    }
    res.send({ Success: true });
  }
});

router.get("/foodItems", async (req, res) => {
  const foodItems = await getFoodItems();

  if (foodItems.length !== 0) {
    res.send({
      Success: "true",
      foodItem: foodItems,
    });
  } else {
    console.log("foodItems not found");
    res.json({ Success: "false" });
  }
});

router.get("/foodCategory", async (req, res) => {
  const foodCategory = await getFoodCategory();

  if (foodCategory.length !== 0) {
    console.log("foodCategory found");
    res.send({
      Success: "true",
      foodCategory: foodCategory,
    });
  } else {
    console.log("foodCategory not found");
    res.json({ Success: "false" });
  }
});

module.exports = router;
