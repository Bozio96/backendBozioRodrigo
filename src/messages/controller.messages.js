const {Router} = require('express');
const router = Router();

router.get('/', (req,res)=>{
    res.render('chat.handlebars', {title:"Chat"} )
})

module.exports = router