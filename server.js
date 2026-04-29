const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

let products = [
  { id: 1, name: "Ejemplo Producto", price: 12000, stock: 10 }
];

let sales = [];
let productIdCounter = 2;
let saleIdCounter = 1;

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.post("/api/products", (req, res) => {
  const { name, price, stock } = req.body;

  if (!name || price === undefined || stock === undefined) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  const newProduct = {
    id: productIdCounter++,
    name: String(name).trim(),
    price: Number(price),
    stock: Number(stock)
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name, price, stock } = req.body;

  const product = products.find(p => p.id === id);
  if (!product) return res.status(404).json({ error: "Producto no encontrado" });

  if (name !== undefined) product.name = String(name).trim();
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);

  res.json(product);
});

app.delete("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const initialLength = products.length;
  products = products.filter(p => p.id !== id);

  if (products.length === initialLength) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json({ ok: true });
});

app.get("/api/sales", (req, res) => {
  res.json(sales);
});

app.post("/api/sales", (req, res) => {
  const { productId, qty } = req.body;

  const quantity = Number(qty);
  const id = Number(productId);

  if (!id || !quantity || quantity <= 0) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  const product = products.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  if (product.stock < quantity) {
    return res.status(400).json({ error: "Stock insuficiente" });
  }

  const subtotal = product.price * quantity;

  product.stock -= quantity;

  const sale = {
    id: saleIdCounter++,
    productId: product.id,
    productName: product.name,
    qty: quantity,
    unitPrice: product.price,
    subtotal,
    date: new Date().toLocaleString("es-CO")
  };

  sales.unshift(sale);
  res.status(201).json(sale);
});

app.get("/api/summary", (req, res) => {
  const totalSales = sales.reduce((sum, s) => sum + s.subtotal, 0);
  const lowStock = products.filter(p => p.stock <= 5).length;

  res.json({
    totalSales,
    totalProducts: products.length,
    totalSalesCount: sales.length,
    lowStock
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
