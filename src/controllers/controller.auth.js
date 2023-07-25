const { Router } = require("express");
const passport = require("passport");
const logger = require("../utils/logger.utils");

const router = Router();

router.post(
  "/",
  passport.authenticate("login", { failureRedirect: "/auth/faillogin" }),
  async (req, res) => {
    try {
      if (!req.user)
        return res
          .status(401)
          .json({
            status: "error",
            error: "Usuario y contraseña no coinciden",
          });

      req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role,
        cartId: req.user.cartId
      };  

      logger.info('Sesion iniciada con éxito')
      res.json({ status: "success", message: "Sesion iniciada" });

      

      /*      CON HASHEO - SIN PASSPORT
        const {email,password} = req.body;
        const user = Users.findOne({email});
        if(!user) return res.status(400).json({error: 'Datos erroneos'})

        const isPasswordValid = passwordValidate(password, user);
        if(!isPasswordValid) return res.status(401).json({error:'Datos erroneos'})

        res.json({message: 'success login'}) */

      /*      SIN HASHEO - Entrega del login simple   
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
        }  */
    } catch (error) {
      logger.error('Error al iniciar sesion', error)
      res.status(500).json({ status: "error", error: "Internal error server" });
    }
  }
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  }
);

router.get("/faillogin", (req, res) => {
  logger.error("Falló estrategia de login")
  /* console.log("Falló estrategia de login"); */
  res.json({ error: "Failed login" });
});

router.get("/redirect", (req, res) => {
  res.redirect("/api/login");
});

module.exports = router;
