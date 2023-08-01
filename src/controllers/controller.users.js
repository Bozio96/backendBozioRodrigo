const {Router} = require('express');
const passport = require('passport');
const path = require('path')

const logger = require('../utils/logger.utils')
const UserRepository = require('../dao/repository/users.repository')
const uploader = require('../utils/multer.utils')
const Users = require('../dao/models/Users.model')


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

router.get('/premium/:uid', async (req, res) => {
    try {  
      
      const {uid} = req.params

      const user = await Users.findById(uid)


      if(user.role === 'administrador'){
        throw new Error('Unauthorized')
      }

      const reqDocuments = ['product','profile','document'];
      const userDocuments = user.documents.map((item)=>{path.basename(item.name, path.extname(item.name))})

      const cumpleRequisitoDocumentos = reqDocuments.every((item)=>{userDocuments.incluides(item)})

      if(!cumpleRequisitoDocumentos){
        throw new Error('Error de documentos')
      }

      const userRepository = new UserRepository()
      const changeRole = await userRepository.changeRole(user)
      logger.info('se cambio el role del usuario actual', changeRole)
      res.json({user: changeRole})
      
    } catch (error) {
      logger.error('Error al cambiar el rol', error)
    }
})

router.post('/:uid/documents', uploader.any(), async (req,res)=>{
  try {
    const {uid} = req.params
    const user = await Users.findById(uid)
    const upDocuments = req.files.map((file) => ({
      name: file.originalname,
      reference: file.filename,
    }))
    user.documents.push(...upDocuments)
    await user.save()
    res.json({message: 'Documentso actualizados'})
  } catch (error) {
    res.status(500).json({error: error})
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