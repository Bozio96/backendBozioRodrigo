const express = require('express')
const {port} = require('./config/app.config')
const handlebars = require('express-handlebars')
const mongoConnect = require('../db');
const {Server} = require('socket.io')
const productManager = require('./dao/ProductManager');
const pm = new productManager('./files/products.json')

const router = require('./router');

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname +'/views');
app.set('view engine', 'handlebars');

mongoConnect()
router(app)

//Levantamiento del servidor de express
const httpServer = app.listen(port, ()=>{console.log(`Server running at port ${port}`)})
const io = new Server(httpServer);

//Levantamiento del servidor de sockets
io.on("connection", async(socket) =>{
    console.log('Cliente conectado en ' + socket.id);

    const products = await pm.getProducts();
    io.emit("realtimeproducts", {products})
})