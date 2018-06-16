const express = require('express');
const router = express.Router();
const Product = require('../models/Products')
const Admin = require('../models/admin');
const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');

isLoggedIn = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next()
    }
    return res.redirect('/admin/login');
};
router.get('/logout',isLoggedIn,(req,res)=>{
    req.logout();
    return res.redirect('/admin/login');
});
router.use('/',(req,res,next)=>{
    if(!req.isAuthenticated()){
        return next();
    }res.redirect('/')
});
router.get('/changepassword',(req,res)=>{
    res.render('change_password',{danger:req.flash('danger')[0],success:req.flash('success')[0]});
});
router.get('/login',(req,res)=>{
    res.render('login',{danger:req.flash('error')[0]});
});
router.post('/login',passport.authenticate('local.signin',{
    successRedirect: '/',
    failureRedirect: '/admin/login',
    failureFlash: true
}));
router.post('/changepassword',(req,res,next)=>{
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;
    var info,message;
    info = '';
    message = '';
    if(!confirmPassword === newPassword) {
        req.flash('danger','Password Not Matching');
        res.redirect('/admin/changepassword');
    }else {
        Admin.findOne({username:'administrator'},(err,user)=>{
            if(err){
                message = "something went wront!!";
                info = "danger";
                req.flash(info,message);
                res.redirect('/admin/changepassword');
            }else {
                if(bcrypt.compareSync(oldPassword,user.password)){
                    user.password = user.encryptPassword(newPassword);
                    user.save((err)=>{
                        if(!err){
                            message = "Password Changed!!";
                            info = "success";
                            req.flash(info,message);
                            res.redirect('/admin/changepassword');
                        }else {
                            message = "Something Went Wrong";
                            info = "danger";
                            req.flash(info,message);
                            res.redirect('/admin/changepassword');
                        }
                    });
                }else {
                    message = "Old Password Is Incorrect";
                    info = "danger";
                    req.flash(info,message);
                    res.redirect('/admin/changepassword');
                }
            }
        });

    }

});



module.exports = router;