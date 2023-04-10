const {Router} = require('express');
const productManager = require('../dao/ProductManager');
const router = Router();
const pm = new productManager('/products.json');

const products = pm.getProducts()

router.get('/', (req,res)=>{
    res.render('home.handlebars', {products, title:"Titulo Dinamico de prueba en index"})
})

module.exports = router