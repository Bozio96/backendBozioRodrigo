const {Router} = require('express');
const productManager = require('../class/ProductManager');
const router = Router();
const pm = new productManager('./files/products.json')

router.get('/', async (req, res) => {
    try {
      const limit = req.query.limit;
      const products = await pm.getProducts();
      const result = limit ? products.slice(0, limit) : products;
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.get('/:pid', async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await pm.getProductById(pid);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
      } else {
        res.status(200).json(product);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.post('/', (req,res)=>{
  try {
    const {title, description, code, price, stock, category, thumbnails} = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ error: 'Todos los campos obligatorios deben ser proporcionados' });
    }
    const products = pm.getProductsArchivo();
    const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
    const newProduct = {
      id,
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails: thumbnails || []
    };

    products.push(newProduct);
    pm.saveProductsArchivo(products);

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:pid', (req, res) => {
    const pid = parseInt(req.params.pid);
    const updatedProduct = req.body;
    pm.updateProduct(pid, updatedProduct);
    res.status(200).json("Producto actualizado con exito");
  });

router.delete('/:pid', (req, res) => {
    const pid = parseInt(req.params.pid);
    pm.deleteProduct(pid);
    res.status(200).json("Producto eliminado con exito");
  });

module.exports = router
