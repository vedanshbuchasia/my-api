const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// GET all products
app.get("/products", (req, res) => {
  fs.readFile("products.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file.");
    res.json(JSON.parse(data));
  });
});

// PATCH quantity of a product
app.patch("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { quantity } = req.body;

  fs.readFile("products.json", "utf8", (err, data) => {
    let products = JSON.parse(data);
    const product = products.find((p) => p.id === id);
    if (!product) return res.status(404).send("Not found");

    product.quantity = quantity;
    fs.writeFile("products.json", JSON.stringify(products, null, 2), (err) => {
      if (err) return res.status(500).send("Write error");
      res.json(product);
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
