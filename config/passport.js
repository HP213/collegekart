const passport = require("passport")
const Admin = require("../models/admin")
const localstrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
passport.serializeUser((admin,done)=>{
    done(null,admin.id)
});
passport.deserializeUser((id,done)=>{
    Admin.findById(id,(err,admin)=>{
        done(err,admin)
    });
});
passport.use('local.signin',new localstrategy({
    usernameField:'username',
    passwordField:'password',
    passReqToCallback:true
},(req,username,password,done)=>{
    Admin.findOne({username:username},(err,admin)=>{
        if(err){
            return done(err);
        }
        if(!admin){
            return done(null,false,{message:'No User Found'});
        }
        if(!bcrypt.compareSync(password,admin.password)){
            return done(null,false,{message:'wrong password'});
        }
        return done(null,admin);
    })
}));