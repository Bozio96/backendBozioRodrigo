const express = require('express')
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport');

const {Server} = require('socket.io')
const {port} = require('./config/app.config')
const {dbAdmin, dbPassword, dbHost, dbName2} = require('./config/db.config')
const mongoConnect = require('../db');
const productManager = require('./dao/ProductManager');
const MessagesDao = require('./dao/Messages.dao')
const router = require('./router');
const initializePassport = require('./config/passport.config')

const pm = new productManager('./files/products.json');
const Messages = new MessagesDao()
const messages = []

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

//Midleware para sessions
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: `mongodb+srv://${dbAdmin}:${dbPassword}@${dbHost}/${dbName2}?retryWrites=true&w=majority`,
            mongoOptions: {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
            ttl: 60,
        }) ,
        secret: "hola",
        resave: false,
        saveUninitialized: false,
    })
)

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const hbs = handlebars.create({
  handlebars: allowInsecurePrototypeAccess(require('handlebars')),
  defaultLayout: 'main'
});

/* app.engine('handlebars', handlebars.engine()); */
app.engine('handlebars', hbs.engine);
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

    /* socket.on('message', data =>{
        messages.push(data) //Guarda los mensajes que recibe
        io.emit('messageLogs', messages) //Muestra en pantalla los mensajes guardados desde el array / DB
    }) */

    socket.on('message', async ({user,message}) =>{
        const chat = await Messages.create(user,message);
        io.emit('messageFinal', chat)
    })

    socket.on('newUser', user =>{
        socket.broadcast.emit('userConnected', user) //Apenas se conecta uno nuevo, avisa a los demas que se conectó
        socket.emit('messageLogs', messages) //Apenas se conecta uno nuevo, retorna los mensajes guardados en el array / DB
    })
    //const products = await pm.getProducts();
    //io.emit("realtimeproducts", {products})
})