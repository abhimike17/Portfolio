const express = require('express');
const router = express.Router();

//Bring in article models
let Article =  require('../models/article');




//Add Route
router.get('/add', function(req, res){
    res.render('add_article', {
        title:'Add Article'
    });
    
});
//Add Submit POST Route
router.post('/add', function(req, res){
    req.checkBody('title','Title is required').notEmpty();
    req.checkBody('author','Title is required').notEmpty();
    req.checkBody('body','Title is required').notEmpty();

//Get errors
let errors = req.validationErrors();

if(errors){
    res.render('add_article',{
        title:'Add Article',
        errors:errors
        
        
    });
    
    }else {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body; 
    
    
    article.save(function(err){
        if(err){
          console.log(err);
          return;
        } else {
            req.flash('success', 'Article added');
          res.redirect('/');
        }
    });
        
    }
    
});

//Load Edit form
router.get('/edit/:id',function(req, res){
    Article.findById(req.params.id, function(err, article){
        res.render('edit_article', {
            title:'Edit Article',
            article:article
        });
    });
});

//Update Submit POST Route
router.post('/edit/:d', function(req, res){
    let article={};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body; 
    
    let query = {_id:req.params.id};
    
    Article.update(query, article, function(err){
        if(err){
          console.log(err);
          return;
        } else {
          req.flash('success', 'Article updated');
          res.redirect('/');
        }
    });
});
router.delete('/:id',function(req,res){
    let query = {_id:req.params.id} //coming from url
    Article.remove(query, function(err){
        if(err){
            console.log(err)
        }
        res.send('Success');
        
    });
});

//get single article
router.get('/:id',function(req, res){
    Article.findById(req.params.id, function(err, article){
        res.render('article',{
            article:article
        });
    });
});

module.exports = router;