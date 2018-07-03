var User = require("../model/users");


/*exports.setLoggedInUser =  function(req,res,next){


    if(req.session && req.session.user){

        User.findOne({'email':req.session.user.email},function(err,user){

            if(user){

                req.user = user;
                delete req.user.password;
                req.session.user = user;
                delete req.session.user.password;
                next();
            }
            else{
                // do nothing
            }
        });
    }
    else{
        next();
    }
}*/

    exports.checkLogin = function(req,res,next){
        if(!req.session.user){

        	req.flash('success_msg', 'Login First');
            res.redirect('/users/login');
        }
        else{
            next();
        }
    }





















