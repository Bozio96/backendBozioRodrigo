const express = require('express')
const {port} = require('./config/app.config')
const handlebars = require('express-handlebars')
const mongoConnect = require('../db');
const {Server} = require('socket.io')
const productManager = require('./dao/ProductManager');
const pm = new productManager('./files/products.json')

const router = require('./router');
const messages = []

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

//Levantamiento del servidor de sockets
const io = new Server(httpServer);

io.on("connection", async(socket) =>{
    console.log('Cliente conectado en ' + socket.id);

    socket.on('message', data =>{
        messages.push(data) //Guarda los mensajes que recibe
        io.emit('messageLogs', messages) //Muestra en pantalla los mensajes guardados desde el array / DB
    })

    socket.on('newUser', user =>{
        socket.broadcast.emit('userConnected', user) //Apenas se conecta uno nuevo, avisa a los demas que se conectó
        socket.emit('messageLogs', messages) //Apenas se conecta uno nuevo, retorna los mensajes guardados en el array / DB
    })
    //const products = await pm.getProducts();
    //io.emit("realtimeproducts", {products})
})