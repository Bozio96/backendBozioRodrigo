const {Router} = require('express')
const router = Router()
const UserDTO = require('../dao/dto/users.dto')
const privateAccess = require('../middlewares/privateAccess.middleware')

router.get('/current', privateAccess ,(req, res) => {
  const session = UserDTO(req.session)
  return res.status(200).json(session)
  /* try {
    const session = UserDTO(req.session)
    return res.status(200).json(session)
   
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  } */
})

module.exports = router