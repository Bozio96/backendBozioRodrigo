function adminAccess(req,res,next){
    if(!req.session.user) return res.redirect('/api/login')
    if( req.session.user.role === 'admin' ){
        next()
    }else{
        res.status(403).json({error:'Forbiden'})
    }
}

module.exports= adminAccess