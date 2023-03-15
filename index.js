const express = require('express')
const productsRouter = require('./routers/products.router')
const cartRouter = require('./routers/cart.router')

const port = 8080
const app = express()

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter) 

app.listen(port, ()=>{
    console.log(`Corriendo en el puerto ${port}`)
})