const {Router} = require('express');
const Users = require('../dao/models/Users.model')

const router = Router();

router.post('/', async(req,res)=>{
    try {
        const {email, password} = req.body
        const user = await Users.findOne({email})
        if(!user){
            return res.status(400).json({status: 'error', error: 'Datos erroneos'})
        }        

        if(user.password !== password){
            return res.status(400).json({status: 'error', error: 'Datos erroneos2'})
        }

        req.session.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            age: user.age,
            email: user.email,
        }

        res.json({status: 'success', message: 'Sesion iniciada'})
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'error', error: 'Internal error server'})
    }
})

router.get('/logout', (req,res)=>{
    req.session.destroy(error=>{
        if(error) return res.json({error})
        res.redirect('/login')
    })
})

module.exports = router