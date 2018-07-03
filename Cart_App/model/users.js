var mongoose = require('mongoose');
var bcrypt = require('bcryptjs')

var Schema = mongoose.Schema

var userSchema = new Schema({
    
    username: {type: String, index: true},
    password: {type: String},
    email: String,
    name: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date
    
})

var User = mongoose.model('User',userSchema)

module.exports = User;

module.exports.createUser = function (newUser,callback) {
    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        newUser.save(callback);
    });
});
}

module.exports.getByUserByUsername  = function (username,callback) {
    var query = {username: username};
    User.findOne(query, callback)
}

module.exports.getByUserById  = function (id,callback) {
    User.findById(id, callback)
}

module.exports.comparePassword = function(candiadtePassword,hash,callback){
    bcrypt.compare(candiadtePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null,isMatch);
    });
}

