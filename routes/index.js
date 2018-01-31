var express = require('express');
var router = express.Router();

var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;
var flash=require('connect-flash');

var User=require('./user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ChatApp',success:req.session.success, errors:req.session.errors });
  req.session.errors=null;

});

router.get('/register', function(req, res){
    res.render('index');
});
router.get('/chat',function (req, res, next) {
   res.render('chat') ;
});

// Login
router.get('/login', function(req, res){
    res.render('login');
});

router.post('/submit',function (req,res,next) {
    //validity
    req.check('name','Name is required').notEmpty();
    req.check('email','Email is required').notEmpty();
    req.check('email','Invalid Email').isEmail();
    req.check('username','Username is required').notEmpty();
    req.check('password','password is required').notEmpty();
    req.check('confirmPassword', 'Password is invalid').isLength({min:8}).equals(req.body.password);

var errors=req.validationErrors();
    if(errors){
        req.session.errors=errors;
        req.session.success=false;
    }else{
        req.session.success=true;
        var newUser=User({
            name:req.body.name,
            email:req.body.email,
            username:req.body.username,
            password:req.body.password
        });
        User.createUser(newUser,function (err,user) {
            if(err) throw err;
            console.log(user);

        })
    }
    res.render('/login');
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username,function (err,user) {
            if(err)throw err;
            if(!user){
                return done(null, false,{message:'Unkown User'});
            }

            User.comparePassword(password, user.password,function (err,isMatch) {
                if(err)throw err;
                if(isMatch){
                    return done(null, user);
                }else{
                    return done(null, false, {message:'Invalid Password'})
                }
            });
        });
    }));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/login',
    passport.authenticate('local',{successRedirect:'/chat', failureRedirect:'/login', failureFlash:true }),
    function(req, res ,next) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.



        console.log(req.user);
});
router.get('/logout',function (req, res) {
    req.logout();
    res.redirect('/');

});


module.exports = router;
