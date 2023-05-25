const passport = require('passport');
const local = require('passport-local');
const GithubStrategy = require('passport-github2')
const Users = require('../dao/models/Users.model');
const {createHash, passwordValidate} = require('../utils/cryptPassword.utils');
const usersCreate = require('../dao/Users.dao');

const LocalStrategy = local.Strategy;

const initializePassport = ()=>{
    passport.use('register',
        new LocalStrategy(
            {passReqToCallback:true, usernameField:'email'},
            async (req,username,password,done)=>{
                try {
                    const {first_name, last_name, email, age, password} = req.body;
                    const user = await Users.findOne({email: username});
                    if (user){ //Esta parte se puede obviar poniendo unique:true en el Schema
                        console.log('Usuario ya existe');
                        return done(null,false);
                    }

                    const newUserInfo = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password),
                    };
                    
                    const newUser = usersCreate(newUserInfo)

                    return done(null, newUser);

                } catch (error) {
                    return done(error)
                }
            }
        )
    );
    passport.use('login',
        new LocalStrategy(
            {usernameField: 'email'},
            async(username,password,done) =>{
                try {
                    const user = await Users.findOne({email: username});

                    if(!user){
                        console.log('Usuario inexistente');
                        return done(null,false);
                    }

                    if(!passwordValidate(password, user)){
                        console.log('Contraseña incorrecta');
                        return done(null,false);
                    }
                    return done(null,user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
    //Demas estrategias aca
    passport.use('github',
    new GithubStrategy({
        clientID: 'Iv1.8ca86ce4644b28b1',
        clientSecret: 'd777cd7dc1d5aaec166c68eb54274a3c3ff9b020',
        callbackURL: 'http://localhost:8080/api/auth/githubcallback',
    },
    async (accessToken, refreshToken, profile, done)=>{
        try {
            const user = await Users.findOne({email: profile._json.email})

            if(!user){
                const newUserInfo = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 18,
                    email: profile._json.email,
                    password: '',
                }
                const newUser = await Users.create(newUserInfo);
                return done(null,newUser);
            }
            done(null,user)
        } catch (error) {
            return done(error)
        }
    }
    ))

    passport.serializeUser((user,done)=>{
        done(null,user.id)
    })

    passport.deserializeUser(async(id,done)=>{
        const user = await Users.findById(id);
        done(null,user)
    })
};

module.exports = initializePassport;
