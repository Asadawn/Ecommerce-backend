// const mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost:27017/e-commerce");

const mongoose = require("mongoose");

const mongoURI = "mongodb://127.0.0.1:27017/e-commerce";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
