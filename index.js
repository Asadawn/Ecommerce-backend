const express = require("express");
const cors = require("cors");
require("./db/config");
const User = require("./db/User");
const app = express();

app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
  // Corrected the route path from "/egister" to "/register"
  try {
    const user = new User(req.body); // Corrected "res" to "req" to use the request body
    const result = await user.save();
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while registering the user." });
  }
});

app.listen(5000, () => console.log("App is running on port 5000"));
