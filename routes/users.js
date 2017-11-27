const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Bring in User model
let User = require('../models/user');

//signup form
router.get('/signup', function(req, res){
    res.render('signup');
});

//signup Process
router.post('/signup', function(req, res){
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const confirm = req.body.confirm;
    
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('confirm', 'Passwords do not match').equals(req.body.password);
    
    let errors = req.validationErrors();
    
    if(errors){
        res.render('signup', {
            errors:errors
        });
    } else{
        let newUser = new User({
            name:name,
            email:email,
            username:username,
            password:password
        });
        bcrypt. genSalt(10, function(err, salt){
            bcrypt.hash(newUser.password, salt, function(err, hash){
                if(err){
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function(err){
                    if(err){
                        console.log(err);
                        return;
                    } else{
                        req.flash('success', 'You have signed up successfully and can log in');
                        res.redirect('/users/login');
                    }
                });
            });
        });
    }
});


//Login Form
router.get('/login', function(req, res){
    res.render('login');
});

//Login process
router.post('/login', function(req, res, next){
    passport.authenticate('local', {
        successRedirect:'/',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req, res, next);
});

// Logout
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'You are Logged out');
    res.redirect('/users/login');
});

module.exports = router;