var mongoose=require('mongoose');
var bcrypt=require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/test');

var UserSchema=mongoose.Schema({
    username:{
        type:String,
        index:true
    },
    password:{
        type:String
    },
    email:{
        type:String
    },
    name:{
        type:String
    }

},{collection:'user-data'});

var User= module.exports=mongoose.model('User',UserSchema);

module.exports.createUser=function (newUser,callback) {

        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newUser.password, salt, function(err, hash) {
               newUser.password=hash;
               newUser.save(callback);
            });
        });
    
};
module.exports.getUserByUsername=function (username,callback) {
    var query={username:username};
    User.findOne(query,callback);

};
module.exports.getUserById=function (id,callback) {

    User.findById(id,callback);

};
module.exports.comparePassword=function (candidatepassword,hash, callback) {
    bcrypt.compare(candidatepassword, hash, function(err, isMatch) {
        if(err)throw err;
        callback(null, isMatch);
    });
    
};