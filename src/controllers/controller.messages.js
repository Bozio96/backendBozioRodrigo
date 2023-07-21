const {Router} = require('express');
const ChatsDao = require('../dao/Messages.dao');
const privateAccess = require('../middlewares/privateAccess.middleware');

const router = Router();
const Chats = new ChatsDao()

router.get('/', async(req,res)=>{ //AGREGAR UN USERACCESS
    try {
        const chats = await Chats.getChats()
        res.render('chat.handlebars', {chats, title:"Chat"} )
    } catch (error) {
        res.status(400).json({error: error})
    }
})

router.post('/', privateAccess, async (req, res) => {
    try {
        const { user, message } = req.body
        const msj = await Chats.create(user, message)
        res.json({ messages: msj })
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error })
    }
})

module.exports = router