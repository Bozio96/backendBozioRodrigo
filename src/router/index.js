const productsRouter = require('../products/controller.products')
const cartRouter = require('../carts/cart.router')
/* const todosLosProductos = require('../products/todosLosProductos.router') */
/* const realTimeProducts = require('../products/realTimeProducts.router') */
const messagesRouter = require('../messages/controller.messages')

const router = app =>{
    app.use('/', productsRouter) //Para que muestre algo al principio
    app.use('/api/products', productsRouter);
    app.use('/api/carts', cartRouter);
    app.use('/api/messages', messagesRouter)
    /* app.use('/', todosLosProductos); */
    /* app.use('/realtimeproducts', realTimeProducts) */
}

module.exports = router