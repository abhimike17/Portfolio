const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config= require('./config/database');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');

mongoose.connect(config.database);
const db = mongoose.connection;




//Check for connection
db.once('open', function(){
    console.log('Connected to MongoDB');
});

//Check for DB errors
db.on('error', function(err){
    console.log(err);
});

//Init app
const app = express();

//Bring in models
let Article = require('./models/article');

//new engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars'); 

//Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Set Public folder
app.use(express.static(path.join(__dirname, 'public')));

//Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;
        
        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg : msg,
            value : value
        };
    }
}));

//Passport config
require('./config/passport')(passport);
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
});

//Home route
app.get('/',(req, res) =>{
    res.render('index');
});

app.get('/articles/save', function(req, res){
    Article.find({}, function(err, articles){
        if(err){
            console.log(err);
        }else{
        res.render('articlesindex', {
        title:' Add Profile ',
        articles: articles
            });
        }
    });    
}); 
//images
app.get('/project/nodekb/images/about-bg.jpg', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'images', 'about-bg.jpg'))
});

app.get('/project/nodekb/images/home-bg.jpg', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'images', 'home-bg.jpg'))
});

app.get('/project/nodekb/images/loading.jpg', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'images', 'loading.jpg'))
});

app.get('/project/nodekb/images/portfolio-img1.jpg', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'images', 'portfolio-img1.jpg'))
});

app.get('/project/nodekb/images/portfolio-img2.jpg', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'images', 'portfolio-img2.jpg'))
});

app.get('/project/nodekb/images/portfolio-img3.jpg', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'images', 'portfolio-img3.jpg'))
});

app.get('/project/nodekb/images/portfolio-img4.jpg', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'images', 'portfolio-img4.jpg'))
});

app.get('/project/nodekb/images/portfolio-img5.jpg', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'images', 'portfolio-img5.jpg'))
});

app.get('/project/nodekb/images/portfolio-img6.jpg', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'images', 'portfolio-img6.jpg'))
});

app.get('/project/nodekb/images/portfolio-img7.jpg', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'images', 'portfolio-img7.jpg'))
});

app.get('/project/nodekb/images/portfolio-img8.jpg', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'images', 'portfolio-img8.jpg'))
});


//function
/*document.getElementById('contactForm').addEventListener('submit',submitform);

//submitform
function submitform(e){
  e.preventDefault();
  
  //get value
  var name = getInputval('name');
  var email = getInputval('email');
  var company = getInputval('company');
  var phone = getInputval('phone');
  var message = getInputval('message');
  
  //save message
  saveMessage(name, company, email, phone, message);
  
  
  
}
//function getInput

function getInputval(id){
  return document.getElementById(id).value;
  
}

//save messages
function saveMessage(name, email, company, phone) {
  var newMessageRef = messagesRef.push();
  newMessage.set({
    name: name,
    company: company,
    email: email,
    phone: phone,
    message: message
  });
  // body...
}*/

//handlebar contact
app.get('#contact',(req, res) =>{
    res.render('contact');
});

//Route files
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);

//post
app.post('/send',(req,res)=> {
    const output = `
You have a new contact request
 Contact Details

Name: ${req.body.name}
Email: ${req.body.email}
Company: ${req.body.company}
Phone: ${req.body.phone}
Message
${req.body.message}
`;
 // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'abhimike17@gmail.com', // generated ethereal user
            pass: '8143432828'  // generated ethereal password
        },
        tls:{
            rejectUnauthorized:false
        }
    });

    let mailOptions = {
            from: '"New User" <abhimike17@gmail.com>', // sender address
            to: 'abhijeethbaregal@gmail.com', // list of receivers
            subject: 'Node Contact request', // Subject line
            text: output, // plain text body
            //pug: output   
        };
    
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            //req.flash('success','Email has been sent');
            res.redirect('/');
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
});

/*
var config = {
    apiKey: "AIzaSyAU6GukOK53qpWCDUNPztfSZ6rWUS4q4Vo",
    authDomain: "portfolio-78ccf.firebaseapp.com",
    databaseURL: "https://portfolio-78ccf.firebaseio.com",
    projectId: "portfolio-78ccf",
    storageBucket: "",
    messagingSenderId: "851719171697"
    };
firebase.initializeApp(config);

//reference messages collection
var messagesRef = firebase.database().ref('messages');
  
*/

//Start server
app.listen(process.env.PORT, function(){
    console.log('Server started  on port 3000!');
});
