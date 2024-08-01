const mongoose = require("mongoose");
const uri = process.env.mongoURL;

mongoose
  .connect(uri)
  .then(console.log("MongoDB connected successfull"))
  .catch((err) => {
    console.log("Some error in DB connection");
    console.log(err);
  });

module.exports = mongoose.connection;
