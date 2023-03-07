const express = require('express')
const port = 8080
const app = express()

const ProductManager = require("./class/ProductManager")
const productManager = new ProductManager("./files/products.json")

app.get('/products', async (req, res) => {
    try {
      const limit = req.query.limit;
      const products = await productManager.getProducts();
      const result = limit ? products.slice(0, limit) : products;
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

app.get('/products/:pid', async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await productManager.getProductById(pid);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
      } else {
        res.json(product);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

app.listen(port, ()=>{
    console.log(`Corriendo en el puerto ${port}`)
})