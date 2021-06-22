const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const User=require('../models/user');


passport.use(new LocalStrategy({
    usernameField:'username'
},
    function(username,password,done){
        User.findOne({username:username},function(err,user){
            if(err)
            {
                console.log('Error in Passport');
                return done(err);
            }
            if(!user || password!=user.password)
            {
                console.log('Invalid password');
                return done(null,false);

            }
            return done(null,user);
        });
        
    }

));

//set which property is to be stored in the cookie
passport.serializeUser(function(user,done){
    done(null,user.id);
});



//Extract user from the cookie sent from the browser
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err)
        {
            console.log('Error in Passport');
            return done(err);
        }
        return done(null,user);
    });
});

module.exports=passport;