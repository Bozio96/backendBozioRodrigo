const viewsTemplateController = require('../viewsTemplate/controller.viewsTemplate')
const authController = require('../auth/controller.auth')
const usersController = require('../users/controller.users')
const productsRouter = require('../products/controller.products')
const cartRouter = require('../carts/cart.router')
/* const todosLosProductos = require('../products/todosLosProductos.router') */
/* const realTimeProducts = require('../products/realTimeProducts.router') */
const messagesRouter = require('../messages/controller.messages')

const router = app =>{
    app.use('/', viewsTemplateController)       
    app.use('/auth', authController) //Login
    app.use('/users', usersController); //Registro

    app.use('/api/products', productsRouter); 
    app.use('/api/carts', cartRouter);
    app.use('/api/messages', messagesRouter)
    /* app.use('/', todosLosProductos); */
    /* app.use('/realtimeproducts', realTimeProducts) */
}

module.exports = router