const productsRouter = require('../products/controller.products')
const cartRouter = require('../carts/cart.router')
/* const todosLosProductos = require('../products/todosLosProductos.router') */
/* const realTimeProducts = require('../products/realTimeProducts.router') */
const messagesRouter = require('../messages/controller.messages')

const router = app =>{
    app.use('/', productsRouter) //Para que muestre algo al principio
    app.use('/api/products', productsRouter); 
    //MODIFICAR: 
    //(?limit=10&?page=1&?query=filtro&?sort=asc/desc) 
    //Son valores por defecto //Los productos se deben buscar por categoria o disponibilidad, y ordenados por precio asc o desc
    app.use('/api/carts', cartRouter);
    //MODIFICAR:
    //DELETE: /:cid/products/:pid --- eliminar del carrito, el producto seleccionado.
    //PUT: /:cid --- actualizar el carrito con un array de productos
    //PUT: /:cid/products/:pid --- actualizar solo la cantidad pasada por req.body
    //DELETE: /:cid --- vaciar el carrito, no eliminarlo
    //GET: /:cid --- el id del producto debe hacer referencia a products. usar "populate"
    app.use('/api/messages', messagesRouter)
    /* app.use('/', todosLosProductos); */
    /* app.use('/realtimeproducts', realTimeProducts) */
}

module.exports = router