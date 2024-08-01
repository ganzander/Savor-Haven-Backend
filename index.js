require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const mongoConnection = require("./connections/mongoConnection");

const port = 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", require("./routes/user"));
app.use("/", require("./routes/food"));
app.use("/", require("./routes/cart"));
app.use("/", require("./routes/order"));

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
