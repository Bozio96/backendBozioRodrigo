const { Router } = require("express");
const CartManager = require("../dao/CartManager");
const ProductManager = require("../dao/ProductManager");
const router = Router();
const pm = new ProductManager("/products.json");
const cm = new CartManager("./files/cart.json", pm);
const uuid = require('uuid');
const privateAccess = require("../middlewares/privateAccess.middleware");

//----------------------DB-------------------------
//Crear carrito vacio
router.post("/", async (req, res) => {
  try {
    const emptyCart = await cm.createCartDB({});
    res.status(201).json({ message: "Carrito creado con exito", emptyCart });
  } catch (error) {
    res.json({ message: error });
  }
});

//Traer carrito por id     
router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cm.getCartDBbyId(cid);

    if (!cart) {
      res.status(404).json({ error: "Carrito No encontrado" });
    } else {
      //res.json({ message: cart });
      res.render('carts.handlebars', {cart});
    }
  } catch (error) {
    res.json({ message: error });
  }
});


router.post("/:cid/products/:pid", privateAccess, async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await cm.getCartDBbyId(cid);
    if (!cart) {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
    const product = await pm.buscarUno(pid);
    if (!product) {
      res.status(404).json({ error: "Producto no encontrado" });
    }
    const itemIndex = cart.productos.findIndex(p => p.product._id.toString() === pid)
    if(itemIndex === -1 ){
      cart.productos.push({
        product: pid,
        quantity: 1
      });
    }else{
      cart.productos[itemIndex].quantity++
    }
    await cart.save(); //Aca cambiarlo por un repository
    res.status(201).json({ message: "Producto agregado al carrito" });
  } catch (error) {
    return error;
  }
}); 

//Elimina un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cm.removeProductFromCart(cid, pid);
    res.json({ message: 'Product removed from cart', cart: updatedCart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error removing product from cart' });
  }
});

//Actualizar un carrito con un array de productos
router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { productos } = req.body;
  
    await cm.updateCartDB(cid, productos);
    res.json({ message: "Carrito actualizado con éxito" });
  } catch (error) {
    res.json({ message: error });
  }
}); //Repite productos

//Actualizar un carrito con la cantidad de productos unicamente
router.put("/:cid/products/:pid", async (req, res) => {
  try {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  //await cm.updateCartItem(cid, pid, quantity); //Si la siguiente linea no funciona, borrarla y colocar esta
  const updatedCart = await cm.updateCartItem(cid, pid, quantity);
  res.json({ message: "Carrito actualizado con éxito", updatedCart }); //Borrar tambien el updatedCart
  } catch (error) {
  res.status(500).json({ error: "Error updating cart" });
  }
  });

//Elimina el carrito completo
router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    await cm.removeAllProductsFromCartDB(cid);
    res.json({ message: "Carrito vaciado" });
  } catch (error) {
    res.json({ message: error });
  }
});


//-------------------NUEVO----------------------
router.post('/:cid/purchase', async(req,res)=>{
  try {
    const sinStock = []
    const conStock = []
    const {cartId} = req.params;
    const cart = cm.getCartDBbyId(cartId)
    cart.productos.forEach(prod => {
      if(prod.quantity <1){
        sinStock.push(prod)
      }else{
        conStock.push(prod);
      }
    })
    //for each no hace falta
        
    const email = req.user.email;
    const code = uuid.v5()

  } catch (error) {
    console.log(error)
    res.status(500).json({error: 'Internal server error'})
  }
})

//-----------------------FS------------------------

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
