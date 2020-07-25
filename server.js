require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// const port = 5000 || process.env.PORT;
const port = process.env.TEST_PORT;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Bring in the models
require("./models/User");
require("./models/Chatroom");
require("./models/Message");

// Route
app.use("/user", require("./routes/user"));

mongoose
  //   .connect(process.env.DB_URI, {
  .connect(process.env.DB_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.log("Mongoose connection ERROR", err.message));

app.listen(port, () => console.log(`Server started on port ${port}`));
