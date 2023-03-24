const {Router} = require('express');
const productManager = require('../class/ProductManager');
const router = Router();
const pm = new productManager('./files/products.json');

const products = pm.getProducts()

router.get('/', (req,res)=>{
    res.render('realTimeProducts.handlebars', {products, title:"Titulo Dinamico de prueba en index"})
})

module.exports = router