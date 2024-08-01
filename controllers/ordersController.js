const mongoose = require("mongoose");
const user = require("../models/User");

async function getOrdersOfUser(req, res) {
  const { email } = req.body;
  try {
    const FoundEmail = await user.findOne({
      email: email,
    });
    if (FoundEmail) {
      res.send({ Success: "true", orders: FoundEmail.order.reverse() });
    } else {
      res.send({ Success: "false", orders: [] });
    }
  } catch (err) {
    console.error(err);
  }
}

async function postOrder(req, res) {
  const { dataWithTime, currentUserAuthToken } = req.body;

  const findUpdatingQuery = { tokens: { token: currentUserAuthToken } };

  const isEmailUpdated = await user.updateOne(findUpdatingQuery, {
    $push: { order: dataWithTime },
  });

  if (isEmailUpdated) {
    res.send({ Success: "true" });
  } else {
    res.send({ Success: "false" });
  }
}
module.exports = {
  getOrdersOfUser,
  postOrder,
};
