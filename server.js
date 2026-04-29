const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

let products = [];
let sales = [];

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.post("/api/products", (req, res) => {
  products.push(req.body);
  res.json({ ok: true });
});

app.post("/api/sales", (req, res) => {
  sales.push(req.body);
  res.json({ ok: true });
});

app.get("/api/sales", (req, res) => {
  res.json(sales);
});

app.listen(3000, () => console.log("Running"));
