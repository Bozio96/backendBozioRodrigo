const {Router} = require('express');
const passport = require('passport');
const logger = require('../utils/logger.utils')
const UserRepository = require('../dao/repository/users.repository')

const router = Router()

router.post('/', passport.authenticate('register',{failureRedirect: '/users/failregister'}), 
async(req,res)=>{
    try {
        logger.info('Usuario registrado con exito')
        res.status(201).json({status: 'success', message: 'Usuario Registrado'})
    } catch (error) {
        logger.error('Error al crear usuario', error)
        /* console.log(error); */
        res.status(500).json({status: 'error', error: 'Internal server error'})
    }    
})

router.get('/premium', async (req, res) => {
    try {  
      const {user} = req.session
      if(user.role === 'administrador'){
        throw new Error('Unauthorized')
      }
      const userRepository = new UserRepository()
      const changeRole = await userRepository.changeRole(user)
      logger.info('se cambio el role del usuario actual', changeRole)
      res.json({user: changeRole})
      
    } catch (error) {
      logger.error('Error al cambiar el rol', error)
    }
  })

router.get('/failregister', (req,res)=>{
    logger.error('Falló estrategia de registro');
   /*  console.log('Falló estrategia de registro'); */
    res.json({error: 'Failed register'})
})


router.get('/redirect', (req,res)=>{
    res.redirect('/api/signup')
})



module.exports = router;