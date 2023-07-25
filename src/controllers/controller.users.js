const {Router} = require('express');
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
})

router.get('/failregister', (req,res)=>{
    console.log('Falló estrategia de registro');
    res.json({error: 'Failed register'})
})


router.get('/redirect', (req,res)=>{
    res.redirect('/api/signup')
})



module.exports = router;