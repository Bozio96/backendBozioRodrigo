const {Router} = require('express');
const Users = require('../dao/models/Users.model');
const {createHash} = require('../utils/cryptPassword.utils')
const passport = require('passport')

const router = Router()

router.post('/', passport.authenticate('register',{failureRedirect: '/users/failregister'}), 
async(req,res)=>{
    try {
        res.status(201).json({status: 'success', message: 'Usuario Registrado'})
    } catch (error) {
        console.log(error);
        res.status(500).json({status: 'error', error: 'Internal server error'})
    }    
    
    /* try {
        const {first_name, last_name, email, age, password} = req.body
        const newUserInfo = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
        }
        await Users.create(newUserInfo)

        res.status(201).json({status: 'success', message: `Usuario con email ${email}, creado con exito`})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({status: 'error', error: 'Internal server error'})
    } */
})

router.get('/failregister', (req,res)=>{
    console.log('Falló estrategia de registro');
    res.json({error: 'Failed register'})
})


router.get('/redirect', (req,res)=>{
    res.redirect('/api/signup')
})



module.exports = router;