const {Router} = require('express')
const router = Router()
const UserDTO = require('../dao/dto/users.dto')

router.get('/current', (req, res) => {
  console.log('Log desde el sesssions current')
  console.log(req.session)
  const session = new UserDTO(req.session.user)
  return res.status(200).json(session)
})

module.exports = router