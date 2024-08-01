const mongoose = require("mongoose");
const user = require("../models/User");

async function postCart(req, res) {
  const { data, currentUserAuthToken } = req.body;
  const findUpdatingQuery = { tokens: { token: currentUserAuthToken } };
  const foodFound = await user.findOne(findUpdatingQuery);
  let duplicateFlag = false;
  foodFound.cart.map((foodItem) => {
    if (foodItem._id === data._id && foodItem.size === data.size) {
      foodItem.qtyOrdered =
        Number(foodItem.qtyOrdered) + Number(data.qtyOrdered);
      duplicateFlag = true;
    }
  });

  if (duplicateFlag === true) {
    const isEmailUpdated = await user.updateOne(findUpdatingQuery, {
      $set: { cart: foodFound.cart },
    });
    if (isEmailUpdated) {
      res.send({ Success: "true", msg: "Item added to cart" });
    } else {
      res.send({ Success: "false", msg: "Error adding to cart" });
    }
  } else {
    const isEmailUpdated = await user.updateOne(findUpdatingQuery, {
      $push: { cart: data },
    });
    if (isEmailUpdated) {
      res.send({ Success: "true", msg: "Item added to cart" });
    } else {
      res.send({ Success: "false", msg: "Error adding to cart" });
    }
  }
}

async function deleteCart(req, res) {
  const { data, currentUserAuthToken } = req.body;
  const findUpdatingQuery = { tokens: { token: currentUserAuthToken } };
  const isEmailUpdated = await user.updateOne(findUpdatingQuery, {
    $set: { cart: data },
  });
  if (isEmailUpdated) {
    res.send({ Success: "true", msg: "Cart emptied" });
  } else {
    res.send({ Success: "false", msg: "Error deleting cart" });
  }
}

async function getCartData(req, res) {
  const { currentUserAuthToken } = req.body;
  const findQuery = { tokens: { token: currentUserAuthToken } };
  const FoundEmail = await user.findOne(findQuery);
  if (FoundEmail) {
    res.send({ Success: "true", cartData: FoundEmail.cart });
  } else {
    res.send({ Success: "false", cartData: [] });
  }
}

async function deleteCartItem(req, res) {
  const { itemId, currentUserAuthToken } = req.body;
  const findUpdatingQuery = { tokens: { token: currentUserAuthToken } };
  const isEmailUpdated = await user.updateOne(findUpdatingQuery, {
    $pull: { cart: { _id: itemId } },
  });
  if (isEmailUpdated) {
    res.send({ Success: "true", msg: "Item deleted from cart" });
  } else {
    res.send({ Success: "false", msg: "Error deleted from cart" });
  }
}

module.exports = { postCart, getCartData, deleteCart, deleteCartItem };
