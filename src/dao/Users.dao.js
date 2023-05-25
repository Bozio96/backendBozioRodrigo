const User = require('../dao/models/Users.model')
const Cart = require('../dao/models/Carts.model')

async function usersCreate(userInfo){
    try {
        const {first_name, last_name, email, age, password} = userInfo

        const cart = new Cart()
        await cart.save()
        const cartId = cart._id

        const newUserInfo = {
            first_name,
            last_name,
            email,
            age,
            password,
            cartId
        }

        const user = await User.create(newUserInfo)
        return user
    } catch (error) {
        return error
    }
} 

module.exports = usersCreate