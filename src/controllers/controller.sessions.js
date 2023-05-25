const {Router} = require('express')
const router = Router()

router.get('/current', (req, res) => {
  try {
    if (req.session && req.session.user) {
      const session = req.session
      return res.status(200).json(session)
    }
    return res.status(401).json({message: 'Not authenticated'})
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

module.exports = router