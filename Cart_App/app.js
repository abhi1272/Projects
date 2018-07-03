var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exhbs =  require("express-handlebars")
var expressValidator = require("express-validator")
var flash = require("connect-flash")
var session = require('express-session')
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require("mongodb")
var bcrypt = require('bcrypt');
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var async = require("async");
var crypto = require("crypto")
var mongoStore = require('connect-mongo')(session)


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/loginapp',{ useMongoClient: true },function(err,db){
    if(err) throw err
        console.log('MongoDb Connected Successfully')
});

var db = mongoose.connection;


var routes = require("./routes/index");
var users = require("./routes/users");
var product = require("./routes/product");
var passwordReset = require("./routes/passwordReset");


//init app
var app = express();


//view Engine 
app.set('views',path.join(__dirname,'views'));
app.engine('handlebars',exhbs({defaultLayout: 'layout'}));
app.set('view engine','handlebars');


//bodyParser Middleware 
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//Set Static Folder 
app.use(express.static(path.join(__dirname,'public')));

//express session 
app.use(session({
    name: 'myLoginSession',
    secret: 'secret',
    httponly: true,
    saveUninitialized: true,
    resave: true,
    //  store: new mongoStore({
    //    mongooseConnection: mongoose.connection
   // }),
    cookie:{secure: false,maxAge: 200000000}
}));



/*app.use(session({
  genid: function(req) {
     console.log(genuuid()) // use UUIDs for session IDs
     console.log(req.session);
  },
   saveUninitialized: true,
   resave: true,
   maxAge: 2000,
  secret: 'keyboard cat'
}))*/


//passport init
app.use(passport.initialize());
app.use(passport.session());


//express validator 
app.use(expressValidator({
    errorFormatter: function(param,msg,value){
        var namespace = param.split('.')
        ,root = namespace.shift()
        ,formParm = root;
    while(namespace.length){
        formParm == '[' +namespace.shift() + ']';
    }
    return {
        param: formParm,
        msg: msg,
        value: value
    };
    }
}))


//connet flash 
app.use(flash());


//connet flash 
app.use(function (req,res,next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.session = req.session;
    res.locals.user = req.user || null;
    next();
})

app.use('/',routes);
app.use('/users',users);
app.use('/product',product);
passwordReset(app);


app.get('*', function(req, res){
  res.send('404 page not found', 404);
});

//set port 

app.set('port',(process.env.PORT || 8000));

app.listen(app.get('port'),function(){
    console.log('Server started on port' + app.get('port'));
})
