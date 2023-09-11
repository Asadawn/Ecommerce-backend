const express = require("express");
const cors = require("cors");
require("./db/config");
const User = require("./db/User");
const Product = require("./db/Product");
const app = express();

app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    const result = await user.save();
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while registering the user." });
  }
});

app.post("/login", async (req, res) => {
  if (req.body.password && req.body.email) {
    try {
      let user = await User.findOne({ email: req.body.email }).select(
        "-password"
      );
      if (user) {
        res.send(user);
      } else {
        res.status(404).send({ result: "No User Found" });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send({ result: "Internal Server Error" });
    }
  } else {
    res.status(400).send({ result: "Bad Request" });
  }
});

app.post("/add-product", async (req, res) => {
  let product = new Product(req.body);
  let result = await product.save();
  res.send(result);
});

app.get("/products", async (req, res) => {
  let products = await Product.find();
  if (products.length > 0) {
    res.send(products);
  } else {
    res.send(result, "No Products Found.");
  }
});

app.delete("/product/:id", async (req, res) => {
  try {
    const result = await Product.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 1) {
      res.send({ message: "Product deleted successfully" });
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

app.listen(5000, () => console.log("App is running on port 5000"));
