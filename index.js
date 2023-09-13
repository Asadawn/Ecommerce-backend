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
  try {
    let products = await Product.find();
    if (products.length > 0) {
      res.send(products);
    } else {
      res.status(404).send({ message: "No Products Found." });
    }
  } catch (error) {
    res.status(500).send({ message: "Error fetching products." });
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

app.get("/product/:id", async (req, res) => {
  try {
    let result = await Product.findOne({ _id: req.params.id });
    if (result) {
      res.send(result);
    } else {
      res.send({ result: "No result found." });
    }
  } catch (error) {
    console.error("Error finding product", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

app.put("/product/:id", async (req, res) => {
  try {
    const result = await Product.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.send(result);
  } catch (error) {
    res.status(500).send("Error updating product");
  }
});

// app.get("/search/:key", async (req, res) => {
//   let result = await Product.findOne({
//     $or: [
//       {
//         name: { $regex: req.params.key },
//         company: { $regex: req.params.key },
//         category: { $regex: req.params.key },
//       },
//     ],
//   });
// });
app.get("/search/:key", async (req, res) => {
  try {
    const result = await Product.find({
      $or: [
        {
          name: { $regex: req.params.key, $options: "i" }, // Case-insensitive search
          company: { $regex: req.params.key, $options: "i" }, // Case-insensitive search
          category: { $regex: req.params.key, $options: "i" }, // Case-insensitive search
        },
      ],
    });

    res.json(result); // Send the search results as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" }); // Handle errors appropriately
  }
});

app.listen(5000, () => console.log("App is running on port 5000"));
