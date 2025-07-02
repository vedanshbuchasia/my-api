const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve static images from the "images" folder
app.use("/image", express.static(path.join(__dirname, "image")));

// ✅ GET all products
app.get("/products", (req, res) => {
  fs.readFile("products.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file.");
    res.json(JSON.parse(data));
  });
});

// ✅ PATCH quantity of a product
app.patch("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { quantity } = req.body;

  fs.readFile("products.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file.");

    let products = JSON.parse(data);
    const product = products.find((p) => p.id === id);
    if (!product) return res.status(404).send("Product not found");

    product.quantity = quantity;

    fs.writeFile("products.json", JSON.stringify(products, null, 2), (err) => {
      if (err) return res.status(500).send("Write error");
      res.json(product);
    });
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

