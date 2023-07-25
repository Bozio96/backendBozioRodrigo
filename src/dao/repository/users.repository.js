const Users = require('../models/Users.model')
const Carts = require('../models/Carts.model')

class UsersRepository {

    createUser = async(userInfo)=>{
        try {
            const {first_name, last_name, email, age, password} = userInfo

            const cart = new Carts()
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

            const user = await Users.create(newUserInfo)
            return user

        } catch (error) {
            throw error
        }
    }
}

module.exports = UsersRepository