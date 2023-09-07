const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  passward: String,
});
module.exports = mongoose.model("users", userSchema);
