const mongoose = require('mongoose')

const collectionName = 'cart'

const collectionSchema = new mongoose.Schema({
    products: [
    {
        /* title: String,
        descripcion: String,
        code: String,
        price: Number,
        stock: Number,
        categoty: String, */
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products'
        },
        quantity: Number
    }
    ]   
})

const Carts = mongoose.model(collectionName, collectionSchema)

module.exports = Carts