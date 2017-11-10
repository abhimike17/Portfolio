const express = require('express');
const path = require('path');
const pug = require('pug');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

let Article = require('./models/article');
mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

//check connection
db.once('open', function(){
    console.log('connected to MongoDB');
});
//check for db errors
db.on('error',function(err){
    console.log(err);
});

//init app
const app = express();




//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body parser middleware application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//set public folder
app.use(express.static(path.join(__dirname,'public')));


/*global session*/
//express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

//express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//express validator middleware
app.use(expressValidator({
errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


//Home Route
app.get('/', function(req,res){
    Article.find({}, function(err, articles){
        if(err){
            console.log(err);
        }else{
         res.render('index', {
        title: 'Articles',
        articles: articles
      });
     }
    });
});

//Routefiles 

let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles',articles);
app.use('/users',users);
//Start server
app.listen(process.env.PORT, function(){
    console.log('Example app listening on port 3000!');
});