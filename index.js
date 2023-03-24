const express = require('express')
const handlebars = require('express-handlebars')
const {Server} = require('socket.io')
const productManager = require('./class/ProductManager');
const pm = new productManager('./files/products.json')

const productsRouter = require('./routers/products.router')
const cartRouter = require('./routers/cart.router')
const todosLosProductos = require('./routers/todosLosProductos.router')
const realTimeProducts = require('./routers/realTimeProducts.router')

const port = 8080
const app = express()

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname +'/views');
app.set('view engine', 'handlebars');

//RUTAS
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/', todosLosProductos);
app.use('/realtimeproducts', realTimeProducts)

const httpServer = app.listen(port, ()=>{console.log(`Corriendo en el puerto ${port}`)})
const io = new Server(httpServer);

//Servidor de sockets
io.on("connection", async(socket) =>{
    console.log('Cliente conectado en ' + socket.id);

    const products = await pm.getProducts();
    io.emit("realtimeproducts", {products})
})