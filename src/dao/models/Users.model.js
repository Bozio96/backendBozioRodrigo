const mongoose = require('mongoose');
const Carts = require('./Carts.model');

const collectionName = 'user';

const collectionSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email:{
        type:String,
        unique: true
    },
    age: Number,
    password: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Carts
    }, //Populate("cart.carts")
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    }
})

const Users = mongoose.model(collectionName, collectionSchema);

module.exports = Users;