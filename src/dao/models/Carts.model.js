const mongoose = require('mongoose')

const collectionName = 'cart'

const collectionSchema = new mongoose.Schema({
    products: {
        type: Array,
        default: []
    }
})

const Carts = mongoose.model(collectionName, collectionSchema)

module.exports = Carts