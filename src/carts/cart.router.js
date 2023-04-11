const { Router } = require('express');
const CartManager = require('../dao/CartManager');
const ProductManager = require('../dao/ProductManager');
const Carts = require('../dao/models/Carts.model');
const router = Router();
const pm = new ProductManager('/products.json');
const cm = new CartManager('./files/cart.json', pm);

//----------------------DB-------------------------
router.post('/', async (req,res)=>{
  try {
    const { products } = req.body
    const newCartInfo = {
        products
    }
    await cm.createCartDB(newCartInfo)
    res.status(201).json({message: 'Carrito creado con exito'})
  } catch (error) {
    res.json({message: error})
  }
})

router.get('/:cid', async (req,res)=>{
  try {
      const{cid} = req.params
      const cart = await cm.getCartDBbyId(cid)
      if (!cart) {
        res.status(404).json({ error: 'Carrito No encontrado' });
      } else {
        res.json({message: cart})
      }
  } catch (error) {
    res.json({message: error})
  }
})

router.post('/:cid/product/:pid', async (req,res)=>{
  try {
    const {cid, pid} = req.params;
    const {quantity} = req.body
    const product = await pm.buscarUno(pid);
    if(!product){
      res.status(404).json({error: 'Producto no encontrado'})
    }else{
      const {id,title, description, code, price, stock, category} = product
      const productInfo = {
        id,
        title,
        description,
        code,
        price,
        stock,
        category,
      }
      const cart = await cm.getCartDBbyId(cid)
      if(!cart){
        res.status(404).json({error: 'Carrito no encontrado'})
      }else{
        await cm.addProductDB(cid, productInfo, quantity)
        res.status(201).json({message: 'Producto agregado al carrito'})
      }
    }
  } catch (error) {
    return error
  }
})

/* router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const quantity = parseInt(req.body.quantity) || 1;
    const product = await pm.getProductById(pid);
    if (!product) {
      res.status(404).json({ error: 'Producto no encontrado' });
    } else {
      const cart = await cm.getCartsById(cid);
      if (!cart) {
        res.status(404).json({ error: 'Carrito no encontrado' });
      } else {
        console.log(cart, product.id, quantity);
        await cm.addProductToCart(cart.id, product.id, quantity);
        res.status(201).json({ message: 'Producto Agregado con exito' });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); */

//-----------------------FS------------------------
/* router.post('/', async (req, res) => {
  try {
    const carts = await cm.getCarts();
    const cart = {
      id: carts.length + 1,
      products: []
    };
    carts.push(cart);
    await cm.saveCartsArchivo(carts);
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 */
/* router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cm.getCartsById(cid);
    if (!cart) {
      res.status(404).json({ error: 'Carrito No encontrado' });
    } else {
      res.json(cart.products);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); */

/* router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const quantity = parseInt(req.body.quantity) || 1;
    const product = await pm.getProductById(pid);
    if (!product) {
      res.status(404).json({ error: 'Producto no encontrado' });
    } else {
      const cart = await cm.getCartsById(cid);
      if (!cart) {
        res.status(404).json({ error: 'Carrito no encontrado' });
      } else {
        console.log(cart, product.id, quantity);
        await cm.addProductToCart(cart.id, product.id, quantity);
        res.status(201).json({ message: 'Producto Agregado con exito' });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); */

module.exports = router;