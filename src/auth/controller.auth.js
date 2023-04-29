const {Router} = require('express');
const Users = require('../dao/models/Users.model')

const router = Router();

router.post('/', async(req,res)=>{
    try {
        const {email, password} = req.body

        if(email === 'adminCoder@coder.com' && password === 'adminCod3r123'){
            req.session.user = {
                first_name: 'Coder',
                last_name: 'House',
                age: 9,
                email: email,
                role: "admin"
            }
            res.json({status: 'success', message: 'Sesion iniciada'})
        }else{
            const user = await Users.findOne({email})
            if(!user){
                return res.status(400).json({status: 'error', error: 'Datos erroneos'})
            }        
    
            if(user.password !== password){
                return res.status(400).json({status: 'error', error: 'Datos erroneos'})
            }
    
            
            req.session.user = {
                first_name: user.first_name,
                last_name: user.last_name,
                age: user.age,
                email: user.email,
                role: user.role
            }
           
            res.json({status: 'success', message: 'Sesion iniciada'})
        } 
       
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'error', error: 'Internal error server'})
    }
})

router.get('/redirect', (req,res)=>{
    res.redirect('/api/login')
})

module.exports = router