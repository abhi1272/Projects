var express =  require("express");
var router = express.Router();
var User = require("../model/users");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


//Register 
router.get('/register',function (req,res) {
    res.render('register');
});

//login 
router.get('/login',function (req,res) {
    res.render('login');
});

// Register Post 
router.post('/register',function (req,res) {
   var name = req.body.name;
   var username =  req.body.username;
   var email =  req.body.email;
   var password = req.body.password;
   var password2 = req.body.password;
   
   req.checkBody('name', 'Name is required').notEmpty();
   req.checkBody('email', 'email is required').notEmpty();
   req.checkBody('email', 'email is not valid').isEmail();
   req.checkBody('username', 'username is required').notEmpty();
   req.checkBody('password', 'password is required').notEmpty();
   req.checkBody('password2', 'password should match').equals(req.body.password);
  
   
   var errors = req.validationErrors();
   
  
   if(errors){
       res.render('register',{
           errors: errors
       });
   }
   else{
       var newUser = new User({
           name: name,
           email: email,
           password: password,
           username: username
       });
       
       User.createUser(newUser,function(err,user){
           if(err) throw err;
           req.session.user = newUser;
           delete req.session.user.password;
       });
       req.flash('success_msg','you are registered and now can login');
       
       res.redirect('/users/login');
   }
   
});

passport.use(new LocalStrategy(
  function(username,password,done){
    User.getByUserByUsername(username,function(err,user){
      if(err) throw err;
      if(!user){
          return done(null, false, {message: 'unknown Error'});
      }
      
      User.comparePassword(password, user.password, function(err, isMatch){
          if(err) throw err;
          if(isMatch){
              return done(null,user);
          }else{
              return done(null,false,{message: 'invalid Password'});
          }
      });
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getByUserById(id, function(err, user) {
    done(err, user);
  });
});


router.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    setTimeout(function()
      {
        console.log('session expired');
      }
      ,5000);
    req.session.user = req.user;
    delete req.session.user.password;
    res.redirect('/');
  });


/*router.post('/login',
  passport.authenticate('local',{
      successRedirect:'/',
      failureRedirect:'/users/login',
      failureFlash: true
      }),
  function(req, res) {
     req.session.user = user;
     console.log(req.session.user);
     //res.redirect('/');
 }); */
  
router.get('/logout',function(req, res) {
   // req.logout();
    
    delete req.session.user
    req.flash('success_msg','you are logged out');
    req.session.destroy(function(err) {
      })
    res.redirect('/users/login')
})  
  
  
module.exports = router;